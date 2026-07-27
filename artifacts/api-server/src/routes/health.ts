import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import nodemailer from "nodemailer";
import { sendEmail } from "../lib/mailer";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/test-smtp", async (_req, res) => {
  const log: string[] = [];
  log.push("Starting Mail and SMTP diagnostics...");

  const host = process.env.SMTP_HOST ?? "smtp.hostinger.com";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const provider = (process.env.EMAIL_PROVIDER ?? "smtp").toLowerCase();

  log.push(`Active EMAIL_PROVIDER: "${provider}"`);
  log.push(`SMTP Config - Host: ${host}, User: ${user ? "Set" : "Not Set"}, Pass: ${pass ? "Set" : "Not Set"}`);
  log.push(`Resend Config - RESEND_API_KEY: ${process.env.RESEND_API_KEY ? "Set" : "Not Set"}`);
  log.push(`SendGrid Config - SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? "Set" : "Not Set"}`);
  log.push(`Mailgun Config - MAILGUN_API_KEY: ${process.env.MAILGUN_API_KEY ? "Set" : "Not Set"}, MAILGUN_DOMAIN: ${process.env.MAILGUN_DOMAIN ?? "Not Set"}`);

  // Test SMTP connection parameters if provider is SMTP or if SMTP user is configured
  if (user && pass) {
    // 1. Test Port 465 (SSL)
    log.push("--- Testing Port 465 (SSL) ---");
    try {
      const transporter465 = nodemailer.createTransport({
        host,
        port: 465,
        secure: true,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        family: 4,
        connectionTimeout: 6000,
        greetingTimeout: 6000,
        socketTimeout: 8000,
      } as any);
      log.push("Connecting to Port 465...");
      await transporter465.verify();
      log.push("SUCCESS: Port 465 connection verified successfully!");
    } catch (err: any) {
      log.push(
        `FAILED Port 465: ${err.message || String(err)} ` +
        `(Code: ${err.code || "N/A"}, Syscall: ${err.syscall || "N/A"}, Command: ${err.command || "N/A"})`
      );
    }

    // 2. Test Port 587 (STARTTLS)
    log.push("--- Testing Port 587 (STARTTLS) ---");
    try {
      const transporter587 = nodemailer.createTransport({
        host,
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        family: 4,
        connectionTimeout: 6000,
        greetingTimeout: 6000,
        socketTimeout: 8000,
      } as any);
      log.push("Connecting to Port 587...");
      await transporter587.verify();
      log.push("SUCCESS: Port 587 connection verified successfully!");
    } catch (err: any) {
      log.push(
        `FAILED Port 587: ${err.message || String(err)} ` +
        `(Code: ${err.code || "N/A"}, Syscall: ${err.syscall || "N/A"}, Command: ${err.command || "N/A"})`
      );
    }
  } else {
    log.push("SMTP credentials (SMTP_USER/SMTP_PASS) not configured. Skipping Port tests.");
  }

  // 3. Test sending actual email using sendEmail utility
  log.push(`--- Testing Actual Email Send via mailer.ts (Provider: ${provider}) ---`);
  try {
    const recipient = process.env.SMTP_TO ?? user ?? "no-recipient-configured@domain.com";
    log.push(`Sending test email to: ${recipient}...`);

    const result = await sendEmail({
      subject: `Diagnostics Test: ${new Date().toISOString()}`,
      to: recipient,
      html: `<p>Diagnostics test from API server. If you see this, email sending is working via <strong>${provider}</strong>!</p>`,
      text: `Diagnostics test from API server. Provider: ${provider}.`,
    });

    if (result.success) {
      log.push(`SUCCESS: Test email sent! Message ID: ${result.messageId}`);
    } else {
      log.push(`FAILED: ${result.error}`);
    }
  } catch (err: any) {
    log.push(`FAILED sending: ${err.message || String(err)}`);
  }

  res.json({ log });
});

export default router;
