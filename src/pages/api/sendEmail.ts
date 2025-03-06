import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { client } from "@/sanity/lib/client";
import { v4 as uuidv4 } from "uuid";

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { to, subject, message }: EmailRequest = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    console.log("🚀 Sending Email to:", to);

    const emailId = uuidv4(); // Unique Email ID
    const trackingPixelUrl = `https://alabbasmail.vercel.app/api/trackOpen?emailId=${emailId}&t=${Date.now()}`;

    // ✅ Use const instead of let
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Mesum Ali" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>You've Got Mail! 📬</h2>
          <p>${message}</p>
          <p>Sent from Al-Abbas Electric</p>

          <!-- Tracking Pixel -->
          <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" />
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully!");

    await client.create({
      _type: "sentEmails",
      _id: emailId,
      to,
      subject,
      message,
      sentAt: new Date().toISOString(),
      isSeen: false, // Default false
    });

    return res.status(200).json({ success: true, message: "Email Sent & Saved Successfully!" });
  } catch (error: unknown) {  // ✅ Use unknown instead of any
    console.error("❌ Error in sendEmail API:", error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
