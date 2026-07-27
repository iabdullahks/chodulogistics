import { Router } from "express";
import { sendEmail } from "../lib/mailer";

const router = Router();

router.post("/carrier-agreement", async (req, res) => {
  try {
    const { formData, pdfBase64 } = req.body as {
      formData: Record<string, any>;
      pdfBase64?: string;
    };

    const isMailConfigured =
      process.env.EMAIL_PROVIDER ||
      process.env.SMTP_USER ||
      process.env.RESEND_API_KEY ||
      process.env.SENDGRID_API_KEY ||
      process.env.MAILGUN_API_KEY;

    if (!isMailConfigured) {
      console.warn("No mail provider or SMTP credentials set on server. Skipping email dispatch.");
      res.json({
        ok: true,
        emailSent: false,
        message: "Submission received, but email service is not configured on the server."
      });
      return;
    }

    // Build selected services list
    const services: string[] = [];
    if (formData.otherServices?.twicCard) services.push("TWIC Card — $360");
    if (formData.otherServices?.trailerRental) services.push("Trailer Rental — $500");
    if (formData.otherServices?.factoringSetup) services.push("Factoring Setup — $250");
    if (formData.otherServices?.insuranceAssistance) services.push("Insurance Assistance — $399");

    const today = new Date().toISOString().split("T")[0];
    const safeName = (formData.carrierFullName as string | undefined)
      ?.replace(/\s+/g, "_") ?? "submission";

    const recipients = [
      formData.email,
      "winston@brokeragecompanyofamericaninc.com"
    ].filter(Boolean) as string[];

    let emailSent = false;
    let emailError: string | undefined;

    try {
      const result = await sendEmail({
        from: `"Brokerage Company of American INC" <${process.env.SMTP_USER}>`,
        to: recipients.length > 0 ? recipients : (process.env.SMTP_TO ?? process.env.SMTP_USER ?? ""),
        subject: "New Carrier Agreement Submitted",
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:620px;margin:30px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);">
    <div style="background:#0d0d0d;padding:24px 32px;display:flex;align-items:center;gap:16px;">
      <div style="width:48px;height:48px;background:#D4AF37;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="color:#000;font-size:20px;font-weight:900;">B</span>
      </div>
      <div>
        <div style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:.5px;">BROKERAGE COMPANY OF</div>
        <div style="color:#D4AF37;font-size:14px;font-weight:700;letter-spacing:.5px;">AMERICAN INC</div>
      </div>
    </div>
    <div style="padding:28px 32px;">
      <h2 style="margin:0 0 20px;color:#1a1a1a;font-size:20px;">New Carrier Agreement Submitted</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;width:170px;"><strong>Dispatch Company:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.dispatchCompany || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>Carrier Name:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.carrierFullName || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>Company Name:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.companyName || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>MC Number:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.mcNumber || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>DOT Number:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.dotNumber || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>License Number:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.drivingLicense || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>Phone:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.phone || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>Email:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.email || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>Lane Setup:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.laneSetupOption || "—"}</td>
        </tr>
        ${services.length ? `<tr style="border-bottom:1px solid #eee;"><td style="padding:8px 0;color:#555;"><strong>Other Services:</strong></td><td style="padding:8px 0;color:#1a1a1a;">${services.join(", ")}</td></tr>` : ""}
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 0;color:#555;"><strong>Payment Method:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${formData.paymentMethod || "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#555;"><strong>Date:</strong></td>
          <td style="padding:8px 0;color:#1a1a1a;">${today}</td>
        </tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#888;">The signed Carrier Setup Agreement PDF is attached to this email.</p>
    </div>
    <div style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#aaa;">Brokerage Company of American INC · 50 Emjay Blvd, Brentwood, NY 11786</p>
    </div>
  </div>
</body>
</html>
        `,
        attachments: pdfBase64
          ? [
              {
                filename: `Carrier_Agreement_${safeName}_${today}.pdf`,
                content: pdfBase64,
                contentType: "application/pdf",
              },
            ]
          : [],
      });
      if (result.success) {
        emailSent = true;
      } else {
        emailError = result.error;
        console.error("sendEmail error:", emailError);
      }
    } catch (err: unknown) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error("sendEmail thrown error:", emailError);
    }

    res.json({
      ok: true,
      emailSent,
      ...(emailError ? { warning: emailError } : {}),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Carrier agreement processing failed:", message);
    res.status(500).json({ ok: false, error: message });
  }
});

export default router;
