import type { shopify } from '..'

export function createSettingSchema(
    setting: shopify.InputSetting
): SettingJsonSchema {
    if (setting.type == 'checkbox') return { type: 'boolean' }
    else if (setting.type == 'number') return { type: 'number' }
    else if (setting.type == 'radio' || setting.type == 'select')
        return { type: 'string', enum: setting.options.map(obj => obj.value) }
    else if (setting.type == 'range')
        return {
            type: 'number',
            minimum: setting.min,
            maximum: setting.max,
            multipleOf: setting.step,
        }
    else return { type: 'string' }
}

export type SettingJsonSchema =
    | { type: 'boolean' }
    | { type: 'number' }
    | { type: 'number'; minimum: number; maximum: number; multipleOf: number }
    | { type: 'string' }
    | { type: 'string'; enum: string[] }
