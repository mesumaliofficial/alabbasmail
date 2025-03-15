import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/sanity/lib/client"; // ✅ Sanity Client Import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("🚀 Fetching All Emails...");

    const query = `*[_type == "sentEmails"] | order(sentAt desc)`;
    const emails = await client.fetch(query);

    console.log("✅ Emails Fetched:", emails);
    return res.status(200).json(emails);
  } catch (error) {
    console.error("❌ Error in getAllEmails API:", error);
    return res.status(500).json({ error: "Failed to fetch emails" });
  }
}
