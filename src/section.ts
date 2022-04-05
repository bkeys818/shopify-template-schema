import {
    createSettingSchema,
    isInputSetting,
    type SettingShopifySchema,
    type SettingJsonSchema,
} from './setting'
import {
    createBlockSchema,
    type BlockShopifySchema,
    type BlockJsonSchema,
} from './block'
import type { JSONSchema7 } from 'json-schema'

export function createSectionSchema(
    fileName: string,
    section?: SectionShopifySchema
): SectionJsonSchema {
    const properties: SectionJsonSchema['properties'] = {
        type: { const: fileName.slice(0, -7) },
        disabled: { type: 'boolean', default: true },
    }

    if (section?.settings) {
        const settings: Record<string, SettingJsonSchema> = {}
        for (const setting of section.settings) {
            if (isInputSetting(setting))
                settings[setting.id] = createSettingSchema(setting)
        }
        properties.settings = { type: 'object', properties: settings }
    }

    if (section?.blocks) {
        properties.blocks = {
            type: 'object',
            additionalProperties: {
                anyOf: section.blocks.map(createBlockSchema),
            },
            maxProperties: section.max_blocks ?? 16,
        }
        properties.block_order = {
            type: 'array',
            items: { type: 'string' },
            maxItems: section.max_blocks ?? 16,
            uniqueItems: true,
        }
    }

    const schema: SectionJsonSchema = {
        type: 'object',
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

export interface SectionJsonSchema extends JSONSchema7 {
    type: 'object'
    properties: {
        type: { const: string }
        disabled: { type: 'boolean'; default: true }
        settings?: {
            type: 'object'
            properties: Record<string, SettingJsonSchema>
        }
        blocks?: {
            type: 'object'
            additionalProperties: { anyOf: BlockJsonSchema[] }
            maxProperties: number
        }
        block_order?: {
            type: 'array'
            items: { type: 'string' }
            maxItems: number
            uniqueItems: true
        }
    }
    additionalProperties: false
    required: ['type']
    dependencies?: {
        blocks: ['block_order']
        block_order: ['blocks']
    }
}
