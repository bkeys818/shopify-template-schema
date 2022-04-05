import {
    createSettingSchema,
    isInputSetting,
    type SettingShopifySchema,
} from './setting'
import { createBlockSchema, type BlockShopifySchema } from './block'
import type { JSONSchema7 } from 'json-schema'

export function createSectionSchema(
    fileName: string,
    section: SectionShopifySchema
): JSONSchema7 {
    const properties: Record<string, JSONSchema7> = {
        type: { const: fileName.slice(0, -7) },
        disabled: { type: 'boolean', default: true },
    }

    if (section.settings) {
        const settings: Record<string, JSONSchema7> = {}
        for (const setting of section.settings) {
            if (isInputSetting(setting))
                settings[setting.id] = createSettingSchema(setting)
        }
        properties.settings = { type: ['object', 'null'], properties: settings }
    }

    if (section.blocks) {
        properties.blocks = {
            type: ['object'],
            additionalProperties: {
                anyOf: section.blocks.map(createBlockSchema),
            },
            maxProperties: section.max_blocks ?? 16,
        }
        properties.block_order = {
            type: ['array'],
            items: { type: 'string' },
            maxItems: section.max_blocks ?? 16,
            uniqueItems: true,
        }
    }

    const schema: JSONSchema7 = {
        properties,
        additionalProperties: false,
        required: ['type'],
    }
    if (schema.properties?.blocks)
        schema.dependencies = {
            blocks: ['block_order'],
            block_order: ['blocks'],
        }
    return schema
}

export interface SectionShopifySchema {
    name: string
    tag?: 'article' | 'aside' | 'div' | 'footer' | 'header' | 'section'
    class?: string
    limit?: number
    settings?: SettingShopifySchema[]
    blocks?: BlockShopifySchema[]
    max_blocks?: number
    presets?: unknown
    default?: unknown
    locales?: unknown
    templates?: string[]
}
