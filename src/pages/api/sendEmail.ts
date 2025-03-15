import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { createClient } from "@sanity/client";
import { v4 as uuidv4 } from "uuid";

// Create a separate Sanity client for the API route
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  useCdn: false,
  apiVersion: "2024-03-15",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
});

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Log the request body (excluding sensitive data)
  console.log("📧 Received email request:", {
    to: req.body.to,
    subject: req.body.subject,
    messageLength: req.body.message?.length
  });

  const { to, subject, message }: EmailRequest = req.body;
  
  // Validate required fields
  if (!to || !subject || !message) {
    console.error("❌ Missing required fields:", { to, subject, hasMessage: !!message });
    return res.status(400).json({ error: "All fields are required!" });
  }

  // Validate email configuration
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("❌ Missing email configuration:", {
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailPass: !!process.env.GMAIL_PASS
    });
    return res.status(500).json({ error: "Email service not configured properly" });
  }

  try {
    console.log("🚀 Sending Email to:", to);

    const emailId = uuidv4();
    const trackingPixelUrl = `${req.headers.origin}/api/trackOpen?emailId=${emailId}&t=${Date.now()}`;

    // Create transporter with debug logging
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      debug: true, // Enable debug logging
    });

    // Test the connection
    try {
      await transporter.verify();
      console.log("✅ SMTP Connection Verified");
    } catch (verifyError) {
      console.error("❌ SMTP Connection Failed:", verifyError);
      return res.status(500).json({ 
        error: "Failed to connect to email service",
        details: verifyError instanceof Error ? verifyError.message : "Unknown error"
      });
    }

    const mailOptions = {
      from: `"Al-Abbas Electric" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>You've Got Mail! 📬</h2>
          <div style="margin: 20px 0;">
            ${message}
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">Sent from Al-Abbas Electric</p>
          <img src="${trackingPixelUrl}" width="1" height="1" style="display:none;" alt="" />
        </div>
      `,
    };

    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email Sent Successfully!", info.messageId);

      // Save to Sanity
      try {
        await client.create({
          _type: "sentEmails",
          _id: emailId,
          to,
          subject,
          message,
          sentAt: new Date().toISOString(),
          isSeen: false,
        });
        console.log("✅ Email saved to Sanity");

        return res.status(200).json({ 
          success: true, 
          message: "Email sent and saved successfully!",
          emailId: info.messageId
        });
      } catch (sanityError) {
        console.error("❌ Error saving to Sanity:", sanityError);
        // Don't fail the request if Sanity save fails
        return res.status(200).json({ 
          success: true, 
          message: "Email sent successfully but failed to save to database",
          emailId: info.messageId
        });
      }
    } catch (sendError) {
      console.error("❌ Error sending email:", sendError);
      return res.status(500).json({ 
        error: "Failed to send email",
        details: sendError instanceof Error ? sendError.message : "Unknown error"
      });
    }

  } catch (error) {
    console.error("❌ Unexpected error in sendEmail API:", error);
    
    let errorMessage = "Failed to send email";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Stack trace:", error.stack);
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
