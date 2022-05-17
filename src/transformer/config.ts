import { jsonSchema, shopify } from '..'

export function configFrom(
    shopifyConfig: shopify.schema.Config,
    templateSchemaPath?: string
): jsonSchema.Config {
    const configProps: Config['definitions']['settings']['properties'] = {}
    if (templateSchemaPath)
        configProps.sections = {
            $ref: `${templateSchemaPath}#/definitions/sections`,
        }
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
    additionalProperties: { $ref: '#/definitions/settings' },
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
            properties: Record<string, jsonSchema.Setting> & {
                sections?: { $ref: `${string}#/definitions/sections` }
            }
        }
        presets: typeof presets
    }
    type: 'object'
    anyOf: typeof anyOf
    required: ['current']
}
