import { type SchemaTypeDefinition } from 'sanity'
import { SentEmails } from '../schemas/SentMails'
import { MailLeads } from '../schemas/lead'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [SentEmails, MailLeads],
}
