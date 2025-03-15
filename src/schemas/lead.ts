export default {
    name: 'lead',
    title: 'Lead',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule: any) => Rule.required().email(),
        },
        {
            name: 'phone',
            title: 'Phone',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'addedAt',
            title: 'Added At',
            type: 'datetime',
            validation: (Rule: any) => Rule.required(),
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'email',
        },
    },
} 