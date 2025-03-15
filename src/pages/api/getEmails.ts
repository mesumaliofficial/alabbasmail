import { NextApiRequest, NextApiResponse } from "next";
import Imap, { ImapSimple, ImapSimpleOptions, Message } from "imap-simple";
import { simpleParser } from "mailparser";

interface ImapMessagePart {
  which: string;
  body: any;
}

interface Email {
  id: number;
  sender: string;
  senderFull: string;
  subject: string;
  subjectFull: string;
  preview: string;
  previewFull: string;
  date: string;
  isUnread: boolean;
  body: string;
  isHtml: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log environment variables (without sensitive data)
  console.log("Environment check:", {
    hasGmailUser: !!process.env.GMAIL_USER,
    hasGmailPass: !!process.env.GMAIL_PASS,
    gmailUserLength: process.env.GMAIL_USER?.length,
  });

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("IMAP credentials are missing");
    return res.status(500).json({ error: "IMAP credentials are missing" });
  }

  const config: ImapSimpleOptions = {
    imap: {
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASS,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      authTimeout: 20000, // Increased timeout
      tlsOptions: { 
        servername: "imap.gmail.com",
        rejectUnauthorized: false // Added to handle potential SSL issues
      },
    },
  };

  let connection: ImapSimple | null = null;

  try {
    console.log("Attempting IMAP connection...");
    connection = await Imap.connect(config);
    console.log("✅ IMAP Connected!");

    console.log("Opening INBOX...");
    await connection.openBox("INBOX");
    console.log("📬 Opened INBOX!");

    const searchCriteria = ["ALL"];
    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: false,
    };

    console.log("🔍 Fetching emails...");
    const messages: Message[] = await connection.search(searchCriteria, fetchOptions);
    console.log(`📩 Total Emails Found: ${messages.length}`);

    if (!messages.length) {
      return res.status(200).json([]); // Return empty array if no emails
    }

    const processedEmails = await Promise.all(
      messages.map(async (message: Message, index: number) => {
        try {
          const headerPart = message.parts.find((part: ImapMessagePart) => part.which === "HEADER");
          if (!headerPart) {
            console.warn(`No header found for email ${index}`);
            return null;
          }

          const header = headerPart.body || {};
          
          // Get the body parts
          const bodyPart = message.parts.find((part: ImapMessagePart) => 
            part.which === "TEXT" || part.which === "TEXT/PLAIN" || part.which === "TEXT/HTML"
          );

          let fullBody = "";
          let isHtml = false;
          const senderRaw = Array.isArray(header.from) ? header.from[0] : "Unknown";
          const subjectRaw = Array.isArray(header.subject) ? header.subject[0] : "No Subject";

          if (bodyPart?.body) {
            try {
              const parsed = await simpleParser(bodyPart.body.toString());
              
              console.log(`Processing email ${index}:`, {
                hasHtml: !!parsed.html,
                hasText: !!parsed.text,
                attachmentsCount: parsed.attachments?.length || 0,
                subject: subjectRaw,
                from: senderRaw
              });

              // Prefer HTML content if available
              if (parsed.html) {
                // Add Gmail-like styling to the HTML content
                fullBody = `
                  <div style="font-family: Arial, sans-serif; color: #202124; line-height: 1.5; padding: 12px;">
                    ${parsed.html}
                  </div>
                `;
                isHtml = true;
              } else {
                // Convert plain text to HTML with Gmail-like styling
                const textContent = parsed.text?.replace(/\n/g, '<br>') || "";
                fullBody = `
                  <div style="font-family: Arial, sans-serif; color: #202124; line-height: 1.5; padding: 12px;">
                    ${textContent.replace(
                      /(https?:\/\/[^\s<]+)/g,
                      '<a href="$1" style="color: #1a73e8; text-decoration: none; hover: text-decoration: underline;" target="_blank">$1</a>'
                    )}
                  </div>
                `;
                isHtml = true;
              }

              // Log email processing details after variables are defined
                  console.log(`Processing email ${index}:`, {
                hasHtml: !!parsed.html,
                hasText: !!parsed.text,
                attachmentsCount: parsed.attachments?.length || 0,
                subject: subjectRaw,
                from: senderRaw
              });

              // Handle embedded images if present
              if (parsed.attachments && parsed.attachments.length > 0) {
                console.log(`Email ${index} has ${parsed.attachments.length} attachments`);
                const imageAttachments = parsed.attachments.filter(att => 
                  att.contentType?.startsWith('image/')
                );
                
                if (imageAttachments.length > 0) {
                  console.log(`Email ${index} has ${imageAttachments.length} image attachments`);
                  // Add image attachments at the bottom of the email
                  fullBody += '<div style="margin-top: 20px; border-top: 1px solid #e8eaed; padding-top: 20px;">';
                  fullBody += '<div style="font-size: 13px; color: #666; margin-bottom: 10px;">Attachments:</div>';
                  fullBody += '<div style="display: flex; flex-wrap: wrap; gap: 10px;">';
                  
                  imageAttachments.forEach(img => {
                    if (img.content) {
                      const base64Image = img.content.toString('base64');
                      fullBody += `
                        <div style="max-width: 100%; margin-bottom: 10px;">
                          <img 
                            src="data:${img.contentType};base64,${base64Image}"
                            style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"
                            alt="${img.filename || 'Attached Image'}"
                          />
                        </div>
                      `;
                    }
                  });
                  
                  fullBody += '</div></div>';
                }
              }
            } catch (parseError) {
              console.error(`Email parsing error for email ${index}:`, parseError);
              // Fallback to plain text if parsing fails
              fullBody = `
                <div style="font-family: Arial, sans-serif; color: #202124; line-height: 1.5; padding: 12px; white-space: pre-wrap;">
                  ${bodyPart.body.toString().replace(/\n/g, '<br>')}
                </div>
              `;
              isHtml = true;
            }
          }

          // Don't strip HTML tags for preview until after we've processed the body
          const previewText = fullBody.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

          // Helper function to truncate text with ellipsis
          const truncateText = (text: string, limit: number) => {
            if (!text) return "";
            // Remove HTML tags for truncated text
            text = text.replace(/<[^>]*>/g, "").trim();
            if (text.length <= limit) return text;
            return `${text.substring(0, limit)}...`;
          };

          // Clean and extract email from sender
          const cleanSender = (from: string) => {
            const match = from.match(/<(.+?)>/) || from.match(/([^\s]+@[^\s]+)/);
            const cleaned = match ? match[1] : from;
            console.log(`Cleaned sender: "${from}" -> "${cleaned}"`);
            return cleaned;
          };

          const cleanedSender = cleanSender(senderRaw);
          
          const email: Email = {
            id: index,
            sender: truncateText(cleanedSender, 20),
            senderFull: cleanedSender,
            subject: truncateText(subjectRaw, 20),
            subjectFull: subjectRaw,
            preview: truncateText(previewText, 30),
            previewFull: previewText,
            date: Array.isArray(header.date) ? header.date[0] : new Date().toISOString(),
            isUnread: !message.attributes.flags.includes("\\Seen"),
            body: fullBody,
            isHtml: isHtml
          };

          return email;
        } catch (error) {
          console.error("Error processing email:", error);
          return null;
        }
      })
    );

    // Filter out any failed emails
    const validEmails = processedEmails.filter((email): email is Email => email !== null);

    // Sort unread emails first
    validEmails.sort((a, b) => (b.isUnread ? 1 : 0) - (a.isUnread ? 1 : 0));

    console.log(`✅ Successfully processed ${validEmails.length} emails`);
    res.status(200).json(validEmails);

  } catch (error) {
    console.error("❌ IMAP Error:", error);
    let errorMessage = "Failed to fetch emails";
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
      console.error("Stack trace:", error.stack);
    }
    return res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : String(error)
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("🔌 IMAP Connection Closed!");
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}
