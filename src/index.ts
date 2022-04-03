import { createSectionSchema, type Section } from './section'
import type { JSONSchema7 } from 'json-schema'
export type { Section }
export type { Block } from './block'
export type { Setting } from './settings'

interface SectionFile {
    fileName: string
    schema: Section
}

export function createTemplateSchema(sections: SectionFile[]): JSONSchema7 {
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
                    sections.length > 0
                        ? {
                              anyOf: sections.map(({ fileName, schema }) =>
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
