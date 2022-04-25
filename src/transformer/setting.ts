import type { jsonSchema, shopify } from '..'

export function settingFrom(
    shopifySetting: shopify.schema.InputSetting
): jsonSchema.Setting {
    if (shopifySetting.type == 'checkbox') return { type: 'boolean' }
    else if (shopifySetting.type == 'number') return { type: 'number' }
    else if (shopifySetting.type == 'radio' || shopifySetting.type == 'select')
        return {
            type: 'string',
            enum: shopifySetting.options.map(obj => obj.value),
        }
    else if (shopifySetting.type == 'range')
        return {
            type: 'number',
            minimum: shopifySetting.min,
            maximum: shopifySetting.max,
            multipleOf: shopifySetting.step,
        }
    else return { type: 'string' }
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
