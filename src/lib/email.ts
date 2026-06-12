import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST ?? "smtp.zoho.com",
  port: Number(process.env.ZOHO_SMTP_PORT) || 465,
  secure: process.env.ZOHO_SMTP_SECURE !== "false",
  auth: {
    user: process.env.ZOHO_SMTP_USER,
    pass: process.env.ZOHO_SMTP_PASS,
  },
});

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export async function sendMail(options: SendMailOptions) {
  const { to, subject, html, cc, bcc, replyTo, attachments } = options;

  const result = await transporter.sendMail({
    from: process.env.ZOHO_MAIL_FROM ?? process.env.ZOHO_SMTP_USER,
    to: Array.isArray(to) ? to.join(",") : to,
    subject,
    html,
    cc: cc ? (Array.isArray(cc) ? cc.join(",") : cc) : undefined,
    bcc: bcc ? (Array.isArray(bcc) ? bcc.join(",") : bcc) : undefined,
    replyTo,
    attachments,
  });

  return result;
}
