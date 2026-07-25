import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody, CreateLeadResponse } from "@workspace/api-zod";
import nodemailer from "nodemailer";

const router: IRouter = Router();

// Create reusable transporter using SMTP from env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lead] = await db
    .insert(leadsTable)
    .values({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      companyName: parsed.data.companyName ?? null,
      subject: parsed.data.subject ?? null,
      serviceInterested: parsed.data.serviceInterested ?? null,
      message: parsed.data.message,
    })
    .returning();

  req.log.info({ leadId: lead.id }, "Lead created");

  // Send email notification if SMTP is configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      await transporter.sendMail({
        from: `"Brokerage Co. of American INC Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: "dispatch@brokeragecompanyofamericaninc.com",
        replyTo: parsed.data.email,
        subject: `New Contact Form: ${parsed.data.serviceInterested || "General Inquiry"} — ${parsed.data.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="background:#0f172a; color:#D4AF37; padding:20px; border-radius:8px 8px 0 0; margin:0;">
              New Contact Form Submission
            </h2>
            <div style="border:1px solid #e2e8f0; border-top:none; border-radius:0 0 8px 8px; padding:24px;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#475569; width:140px;">Name:</td>
                  <td style="padding:8px 0; color:#0f172a;">${parsed.data.fullName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#475569;">Company:</td>
                  <td style="padding:8px 0; color:#0f172a;">${parsed.data.companyName || "—"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#475569;">Email:</td>
                  <td style="padding:8px 0; color:#0f172a;"><a href="mailto:${parsed.data.email}">${parsed.data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#475569;">Phone:</td>
                  <td style="padding:8px 0; color:#0f172a;">${parsed.data.phone}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0; font-weight:bold; color:#475569;">Topic:</td>
                  <td style="padding:8px 0; color:#0f172a;">${parsed.data.serviceInterested || "General Inquiry"}</td>
                </tr>
              </table>
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:16px 0;" />
              <p style="font-weight:bold; color:#475569; margin:0 0 8px;">Message:</p>
              <p style="color:#0f172a; white-space:pre-wrap; margin:0;">${parsed.data.message}</p>
            </div>
            <p style="color:#94a3b8; font-size:12px; margin-top:16px; text-align:center;">
              This message was sent from the contact form at brokeragecompanyofamericaninc.com
            </p>
          </div>
        `,
      });
      req.log.info({ leadId: lead.id }, "Contact form email sent");
    } catch (err) {
      req.log.error({ err }, "Failed to send contact form email");
      // Don't fail the request — the lead was saved to DB
    }
  }

  res.status(201).json(CreateLeadResponse.parse(lead));
});

export default router;
