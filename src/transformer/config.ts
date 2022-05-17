import { jsonSchema, shopify } from '..'

export function configFrom(
    shopifyConfig: shopify.schema.Config
): jsonSchema.Config {
    const configProps: Record<string, jsonSchema.Setting> = {}
    for (const setting of shopifyConfig.flatMap(
        section => section.settings ?? []
    )) {
        if (shopify.schema.isInputSetting(setting))
            configProps[setting.id] = jsonSchema.settingFrom(setting)
    }
    return {
        definitions: {
            settings: { type: 'object', properties: configProps },
            presets,
        },
        type: 'object',
        anyOf,
        required: ['current'],
    }
}

const presets = {
    type: 'object',
    additionalProperties: {
        type: 'object',
        properties: { $ref: '#/definitions/settings' },
    },
}
const anyOf = [
    {
        properties: {
            current: { $ref: '#/definitions/settings' },
            presets: { $ref: '#/definitions/presets' },
        },
    },
    {
        properties: {
            current: { type: 'string' },
            presets: { $ref: '#/definitions/presets' },
        },
        dependencies: { current: ['presets'] },
    },
] as const

export interface Config {
    definitions: {
        settings: {
            type: 'object'
            properties: Record<string, jsonSchema.Setting>
        }
        presets: typeof presets
    }
    type: 'object'
    anyOf: typeof anyOf
    required: ['current']
}
