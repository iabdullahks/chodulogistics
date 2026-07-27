import nodemailer from "nodemailer";
import { logger } from "./logger";

export interface SendEmailAttachment {
  filename: string;
  content: string | Buffer; // Base64 string or Buffer
  contentType?: string;
}

export interface SendEmailParams {
  from?: string; // e.g. '"Display Name" <email@domain.com>'
  to: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: SendEmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends an email using the configured provider (SMTP, Resend, or SendGrid).
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const provider = (process.env.EMAIL_PROVIDER ?? "smtp").toLowerCase();
  
  const toList = Array.isArray(params.to) ? params.to : [params.to];
  const bccList = params.bcc ? (Array.isArray(params.bcc) ? params.bcc : [params.bcc]) : [];

  logger.info({ provider, to: toList, subject: params.subject }, "Attempting to send email");

  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      logger.error("RESEND_API_KEY is not configured");
      return { success: false, error: "RESEND_API_KEY is missing" };
    }

    try {
      const mappedAttachments = params.attachments?.map((att) => ({
        filename: att.filename,
        content: Buffer.isBuffer(att.content) ? att.content.toString("base64") : att.content,
        contentType: att.contentType,
      }));

      // Extract raw email if in format "Name <email@domain.com>" or fallback to SMTP_FROM / SMTP_USER
      const fromField = params.from || process.env.SMTP_FROM || process.env.SMTP_USER;
      if (!fromField) {
        throw new Error("Sender email (from) is not configured");
      }

      const bodyPayload = {
        from: fromField,
        to: toList,
        bcc: bccList.length > 0 ? bccList : undefined,
        reply_to: params.replyTo,
        subject: params.subject,
        html: params.html,
        text: params.text,
        attachments: mappedAttachments,
      };

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json() as any;

      if (!response.ok) {
        logger.error({ responseData: data }, "Resend API returned error status");
        return { success: false, error: data.message || `HTTP ${response.status}` };
      }

      logger.info({ messageId: data.id }, "Email sent successfully via Resend API");
      return { success: true, messageId: data.id };
    } catch (err: any) {
      logger.error({ err }, "Resend API request failed");
      return { success: false, error: err.message || String(err) };
    }
  }

  if (provider === "sendgrid") {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      logger.error("SENDGRID_API_KEY is not configured");
      return { success: false, error: "SENDGRID_API_KEY is missing" };
    }

    try {
      const fromField = params.from || process.env.SMTP_FROM || process.env.SMTP_USER;
      if (!fromField) {
        throw new Error("Sender email (from) is not configured");
      }

      // Parse displays name and email
      // e.g. "Name <email@domain.com>" or "email@domain.com"
      let fromEmail = fromField;
      let fromName: string | undefined;
      const match = fromField.match(/^(?:"?([^"]*)"?\s)?(?:<(.+?)>)$/);
      if (match) {
        fromName = match[1] || undefined;
        fromEmail = match[2];
      }

      const mappedAttachments = params.attachments?.map((att) => ({
        content: Buffer.isBuffer(att.content) ? att.content.toString("base64") : att.content,
        filename: att.filename,
        type: att.contentType || "application/octet-stream",
        disposition: "attachment",
      }));

      const personalizations: any = {
        to: toList.map((email) => ({ email })),
      };

      if (bccList.length > 0) {
        personalizations.bcc = bccList.map((email) => ({ email }));
      }

      const bodyPayload = {
        personalizations: [personalizations],
        from: { email: fromEmail, name: fromName },
        reply_to: params.replyTo ? { email: params.replyTo } : undefined,
        subject: params.subject,
        content: [
          ...(params.text ? [{ type: "text/plain", value: params.text }] : []),
          ...(params.html ? [{ type: "text/html", value: params.html }] : []),
        ],
        attachments: mappedAttachments,
      };

      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const data = await response.json() as any;
          errorMsg = JSON.stringify(data.errors || data);
        } catch {}
        logger.error({ errorResponse: errorMsg }, "SendGrid API returned error status");
        return { success: false, error: errorMsg };
      }

      const messageId = response.headers.get("x-message-id") || "sendgrid-success";
      logger.info({ messageId }, "Email sent successfully via SendGrid API");
      return { success: true, messageId };
    } catch (err: any) {
      logger.error({ err }, "SendGrid API request failed");
      return { success: false, error: err.message || String(err) };
    }
  }

  if (provider === "mailgun") {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    if (!apiKey || !domain) {
      logger.error(
        {
          apiKey: apiKey ? "Set" : "Missing",
          domain: domain ? "Set" : "Missing",
        },
        "Mailgun credentials (MAILGUN_API_KEY or MAILGUN_DOMAIN) not configured"
      );
      return { success: false, error: "Mailgun credentials not configured" };
    }

    try {
      const fromField = params.from || process.env.SMTP_FROM || process.env.SMTP_USER;
      if (!fromField) {
        throw new Error("Sender email (from) is not configured");
      }

      const apiUrl = (process.env.MAILGUN_API_URL ?? "https://api.mailgun.net/v3").replace(/\/$/, "");
      const requestUrl = `${apiUrl}/${domain}/messages`;

      const formData = new FormData();
      formData.append("from", fromField);

      toList.forEach((toEmail) => {
        formData.append("to", toEmail);
      });

      bccList.forEach((bccEmail) => {
        formData.append("bcc", bccEmail);
      });

      if (params.replyTo) {
        formData.append("h:Reply-To", params.replyTo);
      }

      formData.append("subject", params.subject);

      if (params.text) {
        formData.append("text", params.text);
      }
      if (params.html) {
        formData.append("html", params.html);
      }

      if (params.attachments && params.attachments.length > 0) {
        for (const att of params.attachments) {
          const contentBuffer = Buffer.isBuffer(att.content)
            ? att.content
            : Buffer.from(att.content, "base64");
          const blob = new Blob([new Uint8Array(contentBuffer)], { type: att.contentType || "application/octet-stream" });
          formData.append("attachment", blob, att.filename);
        }
      }

      const authHeader = "Basic " + Buffer.from(`api:${apiKey}`).toString("base64");

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
        },
        body: formData,
      });

      const responseText = await response.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { rawResponse: responseText };
      }

      if (!response.ok) {
        logger.error({ responseData, statusCode: response.status }, "Mailgun API returned error status");
        return { success: false, error: responseData.message || responseText || `HTTP ${response.status}` };
      }

      logger.info({ messageId: responseData.id }, "Email sent successfully via Mailgun API");
      return { success: true, messageId: responseData.id };
    } catch (err: any) {
      logger.error({ err }, "Mailgun API request failed");
      return { success: false, error: err.message || String(err) };
    }
  }

  // DEFAULT / FALLBACK: SMTP (nodemailer)
  const host = process.env.SMTP_HOST ?? "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    logger.error("SMTP credentials (SMTP_USER/SMTP_PASS) not configured");
    return { success: false, error: "SMTP credentials not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      family: 4,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    } as any);

    // Hostinger SPF Rule: Enforce that the actual email address in the 'From' header 
    // is EXACTLY the authenticated SMTP_USER.
    // If input is e.g. `"Company Name" <other@domain.com>`, rewrite it to `"Company Name" <SMTP_USER>`.
    let finalizedFrom = params.from || process.env.SMTP_FROM || user;
    const nameMatch = finalizedFrom.match(/^(?:"?([^"]*)"?\s)?(?:<(.+?)>)$/);
    if (nameMatch) {
      const displayName = nameMatch[1];
      if (displayName) {
        finalizedFrom = `"${displayName}" <${user}>`;
      } else {
        finalizedFrom = user;
      }
    } else {
      // If it doesn't match the display name format, force the whole string to be the SMTP user
      if (finalizedFrom !== user) {
        finalizedFrom = `"${finalizedFrom}" <${user}>`;
      }
    }

    const mappedAttachments = params.attachments?.map((att) => ({
      filename: att.filename,
      content: Buffer.isBuffer(att.content) ? att.content : Buffer.from(att.content, "base64"),
      contentType: att.contentType,
    }));

    const info = await transporter.sendMail({
      from: finalizedFrom,
      to: toList,
      bcc: bccList.length > 0 ? bccList : undefined,
      replyTo: params.replyTo,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: mappedAttachments,
    });

    logger.info({ messageId: info.messageId }, "Email sent successfully via SMTP");
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    logger.error(
      {
        host,
        port,
        user,
        err: {
          message: err.message,
          code: err.code,
          command: err.command,
          syscall: err.syscall,
          stack: err.stack,
        },
      },
      "SMTP sendMail failed"
    );
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Asynchronously verifies the SMTP connection during server initialization
 * and logs detailed diagnostics.
 */
export async function verifySmtpConnection(): Promise<void> {
  const provider = (process.env.EMAIL_PROVIDER ?? "smtp").toLowerCase();
  if (provider !== "smtp") {
    logger.info({ provider }, "Email provider is not SMTP; skipping startup SMTP verification.");
    return;
  }

  const host = process.env.SMTP_HOST ?? "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    logger.warn("SMTP startup check: credentials not configured (SMTP_USER or SMTP_PASS missing).");
    return;
  }

  logger.info({ host, port, user }, "SMTP startup check: testing connection...");
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      family: 4,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    } as any);

    await transporter.verify();
    console.log("SMTP startup check: SUCCESS – connection verified successfully!");
  } catch (err: any) {
    console.error("SMTP startup check: FAILED – could not connect to SMTP server.");
    console.error(JSON.stringify(err, null, 2));
  }
}

