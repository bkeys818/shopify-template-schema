import { createSettingSchema, type Setting } from './settings'
import type { JSONSchema7 } from 'json-schema'

export function createBlockSchema(block: Block): JSONSchema7 {
    const properties: Record<string, JSONSchema7> = {
        type: { const: block.type },
    }
    if (block.settings) {
        const settings: Record<string, JSONSchema7> = {}
        for (const setting of block.settings) {
            const schema = createSettingSchema(setting)
            if (schema) settings[setting.id] = schema
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

export interface Block {
    type: string
    name: string
    limit?: number
    settings?: Setting[]
}
