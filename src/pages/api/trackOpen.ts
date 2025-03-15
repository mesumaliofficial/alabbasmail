import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "2nkjtw4g",
  dataset: "production",
  useCdn: false,
  apiVersion: "2022-06-01",
  token: process.env.SANITY_API_TOKEN,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emailId } = req.query;

  console.log("📩 Email ID received:", emailId); // ✅ Debugging

  if (!emailId) {
    console.log("❌ Missing email ID");
    return res.status(400).json({ error: "Missing email ID" });
  }

  try {
    // Fetch the email document from Sanity
    const emailDoc = await client.fetch(`*[_id == $emailId][0]`, { emailId });

    if (!emailDoc) {
      console.log("❌ Email document not found in Sanity");
      return res.status(404).json({ error: "Email not found" });
    }

    console.log("📌 Email document found:", emailDoc);

    // Update the email document to set isSeen = true
    await client
      .patch(emailId as string)
      .set({ isSeen: true })
      .commit();

    console.log("✅ Email status updated in Sanity");

    // Send a 1x1 transparent GIF for tracking
    const trackingPixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
      "base64"
    );

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.send(trackingPixel);
  } catch (error) {
    console.error("❌ Error updating email status:", error);
    res.status(500).json({ error: "Failed to update email status" });
  }
}
