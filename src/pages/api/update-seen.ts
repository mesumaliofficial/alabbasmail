import { createClient } from "@sanity/client";
import { NextApiRequest, NextApiResponse } from "next";

const client = createClient({
  projectId: "2nkjtw4g", // ✅ Apna Sanity Project ID lagao
  dataset: "production",
  useCdn: false,  
  apiVersion: "2023-01-01",
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN // ✅ Apna secret token lagao
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { emailId } = req.body; // ✅ Email ka ID jo update karna hai

  if (!emailId) {
    return res.status(400).json({ message: "Email ID required" });
  }

  try {
    await client.patch(emailId).set({ isSeen: true }).commit();
    res.status(200).json({ success: true, message: "✅ Email marked as seen" });
  } catch (error) {
    console.error("❌ Sanity Update Error:", error);
    res.status(500).json({ success: false, message: "Failed to update email status" });
  }
}
