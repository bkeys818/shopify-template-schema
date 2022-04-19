import { jsonSchema, shopify } from '..'

export function blockFrom(shopifyBlock: shopify.BlockSchema): jsonSchema.Block {
    const properties: Block['properties'] = {
        type: { const: shopifyBlock.type },
    }
    if (shopifyBlock.settings) {
        const settings: Record<string, jsonSchema.Setting> = {}
        for (const setting of shopifyBlock.settings) {
            if (shopify.isInputSetting(setting))
                settings[setting.id] = jsonSchema.settingFrom(setting)
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

export interface Block {
    type: 'object'
    properties: {
        type: { const: string }
        settings?: {
            type: 'object'
            properties: Record<string, jsonSchema.Setting>
        }
    }
    additionalProperties: false
    required: ['type']
}
