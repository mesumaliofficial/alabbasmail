import { SchemaTypeDefinition } from 'sanity';

const leadSchema: SchemaTypeDefinition = {
    name: 'lead',
    title: 'Lead',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required().min(2).max(100)
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule) => Rule.required().email()
        },
        {
            name: 'phone',
            title: 'Phone',
            type: 'string',
            validation: (Rule) => Rule.required()
        },
        {
            name: 'addedAt',
            title: 'Added At',
            type: 'datetime',
            validation: (Rule) => Rule.required()
        }
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email'
        }
    }
};

export default leadSchema; 