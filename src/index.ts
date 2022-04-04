import { createSectionSchema, type Section } from './section'
import type { JSONSchema7 } from 'json-schema'
export type { Section }
export type { Block } from './block'
export type { Setting } from './settings'

export function createTemplateSchema(
    sections: Record<string, Section>
): JSONSchema7 {
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
