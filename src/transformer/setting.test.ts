import { jsonSchema, type shopify } from '..'
import { validate } from 'json-schema'

const defaultSettings = <T extends shopify.Setting['type']>(type: T) => ({
    type,
    id: type + '-setting',
    label: type + '-setting',
})

export const shopifySchemas: {
    [K in shopify.InputSetting['type']]: [
        Extract<shopify.InputSetting, { type: K }>,
        NonNullable<Extract<shopify.InputSetting, { type: K }>['default']>,
        string | boolean | number
    ]
} = {
    checkbox: [{ ...defaultSettings('checkbox') }, true, 'invalid-value'],
    number: [{ ...defaultSettings('number') }, 20, 'invalid-value'],
    radio: [
        {
            ...defaultSettings('radio'),
            options: [
                { label: 'radio-option-1', value: 'Radio Option 1' },
                { label: 'radio-option-2', value: 'Radio Option 2' },
            ],
        },
        'Radio Option 1',
        'invalid-value',
    ],
    range: [{ ...defaultSettings('range'), min: 0, max: 25, step: 5 }, 20, 16],
    select: [
        {
            ...defaultSettings('select'),
            options: [
                { label: 'select-option-1', value: 'Select Option 1' },
                { label: 'select-option-2', value: 'Select Option 2' },
            ],
        },
        'Select Option 1',
        'invalid-value',
    ],
    text: [{ ...defaultSettings('text') }, 'text', false],
    textarea: [{ ...defaultSettings('textarea') }, 'text', false],
    article: [{ ...defaultSettings('article') }, 'text', false],
    blog: [{ ...defaultSettings('blog') }, 'text', false],
    collection: [{ ...defaultSettings('collection') }, 'text', false],
    collection_list: [{ ...defaultSettings('collection_list') }, 'text', false],
    color: [{ ...defaultSettings('color') }, 'text', false],
    color_background: [
        { ...defaultSettings('color_background') },
        'text',
        false,
    ],
    font_picker: [{ ...defaultSettings('font_picker') }, 'text', false],
    html: [{ ...defaultSettings('html') }, 'text', false],
    image_picker: [{ ...defaultSettings('image_picker') }, 'text', false],
    link_list: [{ ...defaultSettings('link_list') }, 'text', false],
    liquid: [{ ...defaultSettings('liquid') }, 'text', false],
    page: [{ ...defaultSettings('page') }, 'text', false],
    product: [{ ...defaultSettings('product') }, 'text', false],
    product_list: [{ ...defaultSettings('product_list') }, 'text', false],
    richtext: [{ ...defaultSettings('richtext') }, 'text', false],
    url: [{ ...defaultSettings('url') }, 'text', false],
    video_url: [
        { ...defaultSettings('video_url'), accept: ['vimeo'] },
        'text',
        false,
    ],
}

describe.each(Object.entries(shopifySchemas))(
    '%s schema',
    (_, [shopifySettingSchema, validValue, invalidValue]) => {
        const schema = jsonSchema.createSettingSchema(shopifySettingSchema)
        if (!schema) return

        it('is valid', () => {
            expect(validate(schema, {}).valid).toBeTruthy()
        })

        it('accepts valid value', () => {
            expect(validValue).toMatchSchema(schema)
        })

        it('catches invalid value', () => {
            expect(invalidValue).not.toMatchSchema(schema)
        })
    }
)
