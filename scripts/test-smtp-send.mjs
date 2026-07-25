import nodemailer from "nodemailer";

const host = "smtp.hostinger.com";
const port = 465;
const user = "winston@brokeragecompanyofamericaninc.com";
const pass = "Dispatch@007792"; // testing if same pass or check dispatch@

console.log(`Testing SMTP sendMail with ${user}...`);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: { user, pass },
  tls: { rejectUnauthorized: false },
});

async function main() {
  try {
    const info = await transporter.sendMail({
      from: `"Brokerage Company of American INC" <${user}>`,
      to: "winston@brokeragecompanyofamericaninc.com",
      subject: "Test Carrier Agreement Email",
      text: "This is a test email to verify SMTP functionality.",
    });
    console.log("SUCCESS! Message sent ID:", info.messageId);
  } catch (err) {
    console.error("FAILED:", err.message);
  }
}

main();
