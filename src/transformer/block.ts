import { createSettingSchema, type SettingJsonSchema } from './setting'
import { shopify } from '..'

export function createBlockSchema(block: shopify.BlockSchema): BlockJsonSchema {
    const properties: BlockJsonSchema['properties'] = {
        type: { const: block.type },
    }
    if (block.settings) {
        const settings: Record<string, SettingJsonSchema> = {}
        for (const setting of block.settings) {
            if (shopify.isInputSetting(setting))
                settings[setting.id] = createSettingSchema(setting)
        }
        properties.settings = { type: 'object', properties: settings }
    }
    return {
        type: 'object',
        properties,
        additionalProperties: false,
        required: ['type'],
    }
}

export interface BlockJsonSchema {
    type: 'object'
    properties: {
        type: { const: string }
        settings?: {
            type: 'object'
            properties: Record<string, SettingJsonSchema>
        }
    }
    additionalProperties: false
    required: ['type']
}
