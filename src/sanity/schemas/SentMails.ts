export const SentEmails = {
  name: "sentEmails",
  type: "document",
  title: "Sent Emails",
  fields: [
    { name: "to", type: "string", title: "Recipient Email" },
    { name: "subject", type: "string", title: "Subject" },
    { name: "message", type: "text", title: "Message" },
    { 
      name: "sentAt", 
      type: "datetime", 
      title: "Sent At",
      initialValue: () => new Date().toISOString() // Auto set current time
    },
    { 
      name: "isSeen", 
      type: "boolean", 
      title: "Seen Status",
      description: "Mark as true if the email has been read",
      initialValue: false // By default, email is unseen
    }
  ]
};
