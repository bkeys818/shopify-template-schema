import type { jsonSchema, shopify } from '..'

export function settingFrom(
    setting: shopify.schema.InputSetting
): jsonSchema.Setting {
    let schema: Setting
    if (setting.type == 'radio' || setting.type == 'select')
        schema = { type: 'string', enum: setting.options.map(obj => obj.value) }
    else if (setting.type == 'range')
        schema = {
            type: 'number',
            minimum: setting.min,
            maximum: setting.max,
            multipleOf: setting.step,
        }
    else if (setting.type == 'checkbox') schema = { type: 'boolean' }
    else if (setting.type == 'number') schema = { type: 'number' }
    else schema = { type: 'string' }
    if (setting.default) schema.default = setting.default
    if (setting.info) schema.description = setting.info
    return schema
}

export type Setting =
    | OptionSetting
    | RangeSetting
    | BasicSetting<number>
    | BasicSetting<boolean>
    | BasicSetting<string>

interface BaseSetting {
    type: 'string' | 'number' | 'boolean'
    description?: string
    default?: unknown
}

interface RangeSetting extends BaseSetting {
    type: 'number'
    minimum: number
    maximum: number
    multipleOf: number
    default?: number
}

interface OptionSetting extends BaseSetting {
    type: 'string'
    enum: string[]
    default?: string
}

interface BasicSetting<T extends string | number | boolean>
    extends BaseSetting {
    type: T extends string ? 'string' : T extends number ? 'number' : 'boolean'
    default?: T
}
