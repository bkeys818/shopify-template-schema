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
    | { type: 'boolean' }
    | { type: 'number' }
    | { type: 'number'; minimum: number; maximum: number; multipleOf: number }
    | { type: 'string' }
    | { type: 'string'; enum: string[] }
