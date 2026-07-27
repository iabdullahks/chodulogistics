import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'winston@brokeragecompanyofamericaninc.com',
    pass: 'Dispatch@007722',
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log("Testing SMTP connection to smtp.hostinger.com:465...");

transporter.sendMail({
  from: '"Test" <winston@brokeragecompanyofamericaninc.com>',
  to: 'winston@brokeragecompanyofamericaninc.com',
  subject: 'SMTP test connection',
  text: 'If you receive this, SMTP is working perfectly!'
}).then(info => {
  console.log("Email sent successfully!");
  console.log(info);
}).catch(err => {
  console.error("Failed to send email.");
  console.error(err);
});
