import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.SMTP_HOST || "smtp.hostinger.com";
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

console.log(`Testing SMTP Connection to ${host}:${port}...`);
console.log(`SMTP User: ${user}`);

if (!user || !pass) {
  console.error("ERROR: SMTP_USER or SMTP_PASS missing in .env file!");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Verification Failed!");
    console.error("Error details:", error.message);
  } else {
    console.log("✅ SMTP Credentials are VALID! Server is ready to send emails.");
  }
});
