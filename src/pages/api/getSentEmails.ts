import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "@/sanity/lib/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const emails = await client.fetch(`*[_type == "sentEmails"] | order(sentAt desc)`);
    return res.status(200).json(emails);
  } catch (error: unknown) {
    console.error("❌ Error in getSentEmails API:", error);
    return res.status(500).json({ error: "Failed to fetch emails" });
  }
}
