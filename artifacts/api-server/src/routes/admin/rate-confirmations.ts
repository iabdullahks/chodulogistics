import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, rateConfirmationsTable, auditLogsTable } from "@workspace/db";
import { sendEmail } from "../../lib/mailer";
import {
  AdminCreateRateConfirmationBody,
  AdminCreateRateConfirmationResponse,
  AdminListRateConfirmationsResponse,
  AdminGetRateConfirmationResponse,
  AdminUpdateRateConfirmationBody,
  AdminUpdateRateConfirmationResponse,
} from "@workspace/api-zod";
import { requireAdminAuth, requirePermission } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin/rate-confirmations", requireAdminAuth);

function toDbValues<T extends { rcDateTime?: Date; outboundAppointmentDate?: Date; returnAppointmentDate?: Date }>(
  data: T,
) {
  return {
    ...data,
    rcDateTime: data.rcDateTime,
    outboundAppointmentDate: data.outboundAppointmentDate
      ? data.outboundAppointmentDate.toISOString().slice(0, 10)
      : data.outboundAppointmentDate,
    returnAppointmentDate: data.returnAppointmentDate
      ? data.returnAppointmentDate.toISOString().slice(0, 10)
      : data.returnAppointmentDate,
  };
}

router.get("/admin/rate-confirmations", async (_req, res): Promise<void> => {
  const rateConfirmations = await db
    .select()
    .from(rateConfirmationsTable)
    .orderBy(desc(rateConfirmationsTable.createdAt));
  res.json(AdminListRateConfirmationsResponse.parse(rateConfirmations));
});

router.get("/admin/rate-confirmations/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [rateConfirmation] = await db
    .select()
    .from(rateConfirmationsTable)
    .where(eq(rateConfirmationsTable.id, id));
  if (!rateConfirmation) {
    res.status(404).json({ error: "Rate confirmation not found" });
    return;
  }

  res.json(AdminGetRateConfirmationResponse.parse(rateConfirmation));
});

router.post(
  "/admin/rate-confirmations",
  requirePermission("rateConfirmations", "write"),
  async (req, res): Promise<void> => {
    const parsed = AdminCreateRateConfirmationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [rateConfirmation] = await db
      .insert(rateConfirmationsTable)
      .values(toDbValues(parsed.data))
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "create",
      entityType: "rate_confirmation",
      entityId: String(rateConfirmation.id),
      before: null,
      after: rateConfirmation,
    });

    // ── Send email to carrier ─────────────────────────────────────────────────
    const carrierEmail = (rateConfirmation as any).carrierEmail as string | null;
    const isMailConfigured =
      process.env.EMAIL_PROVIDER ||
      process.env.SMTP_USER ||
      process.env.RESEND_API_KEY ||
      process.env.SENDGRID_API_KEY ||
      process.env.MAILGUN_API_KEY;

    if (carrierEmail && isMailConfigured) {
      try {
        const rc = rateConfirmation as any;
        const proNum = rc.proNumber || "N/A";
        const totalRate = rc.totalRateUsd ? `$${Number(rc.totalRateUsd).toFixed(2)}` : "N/A";
        const rcDate = rc.rcDateTime ? new Date(rc.rcDateTime).toLocaleDateString("en-US") : "N/A";

        await sendEmail({
          from: `"BROKERAGE COMPANY OF AMERICAN INC" <${process.env.SMTP_USER}>`,
          to: carrierEmail,
          bcc: process.env.SMTP_USER,
          subject: `Rate Confirmation — PRO #${proNum}`,
          html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <div style="max-width:640px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);">
    <div style="background:#0d0d0d;padding:24px 32px;">
      <div style="color:#D4AF37;font-size:18px;font-weight:900;letter-spacing:1px;">BROKERAGE COMPANY OF AMERICAN INC</div>
      <div style="color:#888;font-size:12px;margin-top:4px;">50 Emjay Blvd, Brentwood, NY 11786</div>
    </div>
    <div style="padding:28px 32px;">
      <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:20px;">Rate Confirmation</h2>
      <p style="margin:0 0 20px;color:#555;font-size:14px;">PRO # <strong>${proNum}</strong> &nbsp;|&nbsp; Date: <strong>${rcDate}</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="background:#fef9c3;border-bottom:2px solid #D4AF37;">
          <td style="padding:10px 12px;font-weight:700;color:#78350f;">Carrier</td>
          <td style="padding:10px 12px;color:#1a1a1a;">${rc.carrierName || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">MC #</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.mcNumber || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">DOT #</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.dotNumber || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Driver</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.driverName || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Driver Cell</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.driverCell || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Truck #</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.truckNumber || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Trailer #</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.trailerNumber || "—"}</td>
        </tr>
        <tr style="background:#fef9c3;border-bottom:2px solid #D4AF37;">
          <td style="padding:10px 12px;font-weight:700;color:#78350f;">Load Info</td>
          <td style="padding:10px 12px;"></td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Miles</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.miles ?? "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Pieces</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.pieces ?? "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Weight</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.weightLbs ? `${rc.weightLbs} lbs` : "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Description</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.description || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Hot Load</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.hotLoad ? "YES" : "No"}</td>
        </tr>
        <tr style="background:#fef9c3;border-bottom:2px solid #D4AF37;">
          <td style="padding:10px 12px;font-weight:700;color:#78350f;">Outbound</td>
          <td style="padding:10px 12px;"></td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Pickup</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.outboundPickupAddress || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Delivery</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.outboundDeliveryAddress || "—"}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:8px 12px;color:#555;">Appt Date</td>
          <td style="padding:8px 12px;color:#1a1a1a;">${rc.outboundAppointmentDate || "—"} ${rc.outboundAppointmentTime || ""}</td>
        </tr>
        <tr style="background:#fef9c3;border-bottom:2px solid #D4AF37;">
          <td style="padding:10px 12px;font-weight:700;color:#78350f;">Rate</td>
          <td style="padding:10px 12px;font-size:18px;font-weight:900;color:#D4AF37;">${totalRate}</td>
        </tr>
      </table>
      ${rc.specialInstructions ? `<div style="margin-top:20px;padding:16px;background:#fef9c3;border-left:4px solid #D4AF37;border-radius:4px;font-size:13px;color:#78350f;">${rc.specialInstructions.replace(/\n/g, "<br/>")}</div>` : ""}
    </div>
    <div style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;font-size:11px;color:#aaa;">BROKERAGE COMPANY OF AMERICAN INC · 50 Emjay Blvd, Brentwood, NY 11786</p>
      <p style="margin:4px 0 0;font-size:11px;color:#aaa;">For questions contact: winston@brokeragecompanyofamericaninc.com</p>
    </div>
  </div>
</body>
</html>`,
          attachments: req.body.pdfBase64
            ? [
                {
                  filename: `Rate_Confirmation_${proNum}.pdf`,
                  content: req.body.pdfBase64,
                  contentType: "application/pdf",
                },
              ]
            : [],
        });
        console.log(`[rate-confirmation] Email sent to carrier: ${carrierEmail}`);
      } catch (emailErr) {
        // Email failure is non-fatal — log it but don't block the response
        console.error("[rate-confirmation] Failed to send carrier email:", emailErr);
      }
    }
    // ──────────────────────────────────────────────────────────────────────────

    res.status(201).json(AdminCreateRateConfirmationResponse.parse(rateConfirmation));
  },
);

router.patch(
  "/admin/rate-confirmations/:id",
  requirePermission("rateConfirmations", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = AdminUpdateRateConfirmationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(rateConfirmationsTable)
      .where(eq(rateConfirmationsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Rate confirmation not found" });
      return;
    }

    const [updated] = await db
      .update(rateConfirmationsTable)
      .set(toDbValues(parsed.data))
      .where(eq(rateConfirmationsTable.id, id))
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "update",
      entityType: "rate_confirmation",
      entityId: String(id),
      before: existing,
      after: updated,
    });

    res.json(AdminUpdateRateConfirmationResponse.parse(updated));
  },
);

router.delete(
  "/admin/rate-confirmations/:id",
  requirePermission("rateConfirmations", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [existing] = await db
      .select()
      .from(rateConfirmationsTable)
      .where(eq(rateConfirmationsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Rate confirmation not found" });
      return;
    }

    await db.delete(rateConfirmationsTable).where(eq(rateConfirmationsTable.id, id));

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "delete",
      entityType: "rate_confirmation",
      entityId: String(id),
      before: existing,
      after: null,
    });

    res.status(204).end();
  },
);

export default router;
