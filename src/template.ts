import {
    createSectionSchema,
    type SectionShopifySchema,
    type SectionJsonSchema,
} from './section'
import type { JSONSchema7 } from 'json-schema'

export function createTemplateSchema(
    sections: Record<string, SectionShopifySchema>
): TemplateJsonSchema {
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
                        ? {
                              anyOf: Object.entries(sections).map(
                                  ([fileName, schema]) =>
                                      createSectionSchema(fileName, schema)
                              ),
                          }
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

export interface TemplateJsonSchema extends JSONSchema7 {
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
            additionalProperties: { anyOf: SectionJsonSchema[] } | false
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
