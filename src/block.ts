import {
    createSettingSchema,
    isInputSetting,
    type SettingShopifySchema,
    type SettingJsonSchema,
} from './setting'
import type { JSONSchema7 } from 'json-schema'

export function createBlockSchema(block: BlockShopifySchema): JSONSchema7 {
    const properties: Record<string, JSONSchema7> = {
        type: { const: block.type },
    }
    if (block.settings) {
        const settings: Record<string, JSONSchema7> = {}
        for (const setting of block.settings) {
            if (isInputSetting(setting))
                settings[setting.id] = createSettingSchema(setting)
        }
        properties.settings = { type: ['object', 'null'], properties: settings }
    }
    return {
        type: 'object',
        properties,
        additionalProperties: false,
        required: ['type'],
    }
}

export interface BlockShopifySchema {
    type: string
    name: string
    limit?: number
    settings?: SettingShopifySchema[]
}

export interface BlockJsonSchema extends JSONSchema7 {
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
