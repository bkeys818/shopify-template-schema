import { jsonSchema, shopify } from '..'

export function sectionFrom(
    fileName: string,
    shopifySection?: shopify.SectionSchema
): jsonSchema.Section {
    const properties: Section['properties'] = {
        type: { const: makeTypeFrom(fileName) },
        disabled: { type: 'boolean', default: true },
    }

    if (shopifySection?.settings) {
        const settings: Record<string, jsonSchema.Setting> = {}
        for (const setting of shopifySection.settings) {
            if (shopify.isInputSetting(setting))
                settings[setting.id] = jsonSchema.settingFrom(setting)
        }
        properties.settings = { type: 'object', properties: settings }
    }

    if (shopifySection?.blocks) {
        properties.blocks = {
            type: 'object',
            additionalProperties: {
                anyOf: shopifySection.blocks.map(jsonSchema.blockFrom),
            },
            maxProperties: shopifySection.max_blocks ?? 16,
        }
        properties.block_order = {
            type: 'array',
            items: { type: 'string' },
            maxItems: shopifySection.max_blocks ?? 16,
            uniqueItems: true,
        }
    }

    const schema: Section = {
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

export function makeTypeFrom(file: string) {
    const start = file.lastIndexOf('/')
    const end = file.lastIndexOf('.')
    return file.slice(start === -1 ? 0 : start + 1, end)
}

export interface Section {
    type: 'object'
    properties: {
        type: { const: string }
        disabled: { type: 'boolean'; default: true }
        settings?: {
            type: 'object'
            properties: Record<string, jsonSchema.Setting>
        }
        blocks?: {
            type: 'object'
            additionalProperties: { anyOf: jsonSchema.Block[] }
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
