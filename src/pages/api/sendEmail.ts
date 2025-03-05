import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { client } from "@/sanity/lib/client"; // Sanity Client Import

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  attachments?: { filename: string; content: string; encoding: string }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, subject, message, attachments }: EmailRequest = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    console.log("🚀 Sending Email to:", to);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let mailOptions: any = {
      from: `"Mesum Ali" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">You've Got Mail! 📬</h2>
            <p style="font-size: 16px; color: #555;">${message}</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="text-align: center; font-size: 14px; color: #888;">Sent from Al-Abbas Electric</p>
          </div>
        </div>
      `,
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map((file) => ({
        filename: file.filename,
        content: file.content,
        encoding: file.encoding,
      }));
    }

    // ✅ **Send Email**
    await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully!");

    // ✅ **Sanity mein Save Karna**
    const newEmail = await client.create({
      _type: "sentEmails",
      to,
      subject,
      message,
      sentAt: new Date().toISOString(),
      isSeen: false, // By default false
    });

    console.log("✅ Email Saved in Sanity:", newEmail);

    return res.status(200).json({ success: true, message: "Email Sent & Saved Successfully!" });
  } catch (error: any) {
    console.error("❌ Error in sendEmail API:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
