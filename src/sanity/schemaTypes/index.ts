import { type SchemaTypeDefinition } from 'sanity'
import { SentEmails } from '../schemas/SentMails'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [SentEmails],
}
