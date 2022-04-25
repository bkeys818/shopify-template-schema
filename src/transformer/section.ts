import { jsonSchema, shopify } from '..'

export function sectionFrom(
    fileName: string,
    shopifySection?: shopify.schema.Section
): jsonSchema.Section {
    const type = makeTypeFrom(fileName)
    const properties: Section['properties'] = {
        type: { const: type },
        disabled: { type: 'boolean', default: true },
    }

    if (shopifySection?.settings) {
        const settings: Record<string, jsonSchema.Setting> = {}
        for (const setting of shopifySection.settings) {
            if (shopify.schema.isInputSetting(setting))
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

    if (shopifySection?.default) {
        schema.default = {
            type: type,
            ...shopifySection.default,
        }
        if (shopifySection.default.blocks)
            schema.default.block_order = Object.keys(
                shopifySection.default.blocks
            )
    }
    if (shopifySection?.presets)
        schema.defaultSnippets = shopifySection.presets.map(
            ({ name, settings, blocks }) => {
                const body: VSCodeSnippet<shopify.Section>['body'] = { type }
                if (settings) body.settings = settings
                if (blocks) {
                    body.blocks = { ...blocks } as any
                    body.block_order = Object.keys(blocks)
                }
                return { label: name, body }
            }
        )

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
    default?: shopify.Section
    defaultSnippets?: VSCodeSnippet<shopify.Section>[]
}

interface VSCodeSnippet<T> {
    label?: string
    description?: string
    body: T
}
