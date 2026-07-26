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
  log.push("Starting SMTP Connection diagnostics...");
  
  const host = process.env.SMTP_HOST ?? "smtp.hostinger.com";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  log.push(`Config - Host: ${host}, User: ${user ? "Set" : "Not Set"}`);

  if (!user || !pass) {
    res.json({ ok: false, error: "SMTP credentials not configured on backend", log });
    return;
  }

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
    });
    log.push("Connecting to Port 465...");
    await transporter465.verify();
    log.push("SUCCESS: Port 465 connection verified successfully!");
  } catch (err: any) {
    log.push(`FAILED Port 465: ${err.message || String(err)} (Code: ${err.code || "N/A"})`);
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
    });
    log.push("Connecting to Port 587...");
    await transporter587.verify();
    log.push("SUCCESS: Port 587 connection verified successfully!");
  } catch (err: any) {
    log.push(`FAILED Port 587: ${err.message || String(err)} (Code: ${err.code || "N/A"})`);
  }

  res.json({ log });
});

export default router;
