import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import nodemailer from "nodemailer";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/test-smtp", async (_req, res) => {
  const log: string[] = [];
  log.push("Starting SMTP Connection test...");
  
  const host = process.env.SMTP_HOST ?? "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  log.push(`Config - Host: ${host}, Port: ${port}, Secure: ${secure}, User: ${user ? "Set (length: " + user.length + ")" : "Not Set"}`);

  if (!user || !pass) {
    res.json({ ok: false, error: "SMTP credentials not configured on backend", log });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      family: 4,
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });

    log.push("Verifying SMTP connection...");
    await transporter.verify();
    log.push("Verification successful! Sending test email...");

    const info = await transporter.sendMail({
      from: `"Diagnostics" <${process.env.SMTP_FROM ?? user}>`,
      to: user,
      subject: "Render SMTP Diagnostic Test",
      text: "Connection test from Render container successful!",
    });
    log.push(`Email sent successfully! MessageID: ${info.messageId}`);
    res.json({ ok: true, log });
  } catch (err: any) {
    log.push(`Error encountered: ${err.message || String(err)}`);
    if (err.code) log.push(`Error Code: ${err.code}`);
    res.json({ ok: false, log });
  }
});

export default router;
