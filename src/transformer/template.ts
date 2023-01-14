import { jsonSchema, shopify } from '..'

export function templateFrom(
    sections: Record<string, shopify.schema.Section | undefined>
): Template {
    return {
        type: 'object',
        properties: {
            name: { type: 'string' },
            layout: {
                anyOf: [{ const: false }, { type: 'string' }],
                default: 'theme.liquid',
            },
            wrapper: { type: 'string' },
            sections: {
                type: 'object',
                additionalProperties:
                    Object.keys(sections).length > 0
                        ? jsonSchema.factor.anyOf(
                              Object.entries(sections).map(
                                  ([filePath, schema]) =>
                                      jsonSchema.sectionFrom(filePath, schema)
                              )
                          )
                        : false,
                maxProperties: 20,
            },
            order: {
                type: 'array',
                items: { type: 'string' },
                maxItems: 20,
                uniqueItems: true,
            },
        },
        required: ['sections', 'order'],
        additionalProperties: false,
    }
}

export interface Template {
    type: 'object'
    properties: {
        name: { type: 'string' }
        layout: {
            anyOf: [{ const: false }, { type: 'string' }]
            default: 'theme.liquid'
        }
        wrapper: { type: 'string' }
        sections: {
            type: 'object'
            additionalProperties:
                | jsonSchema.factor.AnyOf<jsonSchema.Section>
                | false
            maxProperties: 20
        }
        order: {
            type: 'array'
            items: { type: 'string' }
            maxItems: 20
            uniqueItems: true
        }
    }
    required: ['sections', 'order']
    additionalProperties: false
}
