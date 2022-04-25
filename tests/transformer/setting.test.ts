import { jsonSchema, type shopify } from '../../src'
import { baseSettingFor } from './utils'

export const shopifySchemas: {
    [K in shopify.schema.InputSetting['type']]: [
        Extract<shopify.schema.InputSetting, { type: K }>,
        NonNullable<
            Extract<shopify.schema.InputSetting, { type: K }>['default']
        >,
        string | boolean | number
    ]
} = {
    checkbox: [{ ...baseSettingFor('checkbox') }, true, 'invalid-value'],
    number: [{ ...baseSettingFor('number') }, 20, 'invalid-value'],
    radio: [
        {
            ...baseSettingFor('radio'),
            options: [
                { label: 'radio-option-1', value: 'Radio Option 1' },
                { label: 'radio-option-2', value: 'Radio Option 2' },
            ],
        },
        'Radio Option 1',
        'invalid-value',
    ],
    range: [{ ...baseSettingFor('range'), min: 0, max: 25, step: 5 }, 20, 16],
    select: [
        {
            ...baseSettingFor('select'),
            options: [
                { label: 'select-option-1', value: 'Select Option 1' },
                { label: 'select-option-2', value: 'Select Option 2' },
            ],
        },
        'Select Option 1',
        'invalid-value',
    ],
    text: [{ ...baseSettingFor('text') }, 'text', false],
    textarea: [{ ...baseSettingFor('textarea') }, 'text', false],
    article: [{ ...baseSettingFor('article') }, 'text', false],
    blog: [{ ...baseSettingFor('blog') }, 'text', false],
    collection: [{ ...baseSettingFor('collection') }, 'text', false],
    collection_list: [{ ...baseSettingFor('collection_list') }, 'text', false],
    color: [{ ...baseSettingFor('color') }, 'text', false],
    color_background: [
        { ...baseSettingFor('color_background') },
        'text',
        false,
    ],
    font_picker: [{ ...baseSettingFor('font_picker') }, 'text', false],
    html: [{ ...baseSettingFor('html') }, 'text', false],
    image_picker: [{ ...baseSettingFor('image_picker') }, 'text', false],
    link_list: [{ ...baseSettingFor('link_list') }, 'text', false],
    liquid: [{ ...baseSettingFor('liquid') }, 'text', false],
    page: [{ ...baseSettingFor('page') }, 'text', false],
    product: [{ ...baseSettingFor('product') }, 'text', false],
    product_list: [{ ...baseSettingFor('product_list') }, 'text', false],
    richtext: [{ ...baseSettingFor('richtext') }, 'text', false],
    url: [{ ...baseSettingFor('url') }, 'text', false],
    video_url: [
        { ...baseSettingFor('video_url'), accept: ['vimeo'] },
        'text',
        false,
    ],
}

describe.each(Object.entries(shopifySchemas))(
    '%s schema',
    (_, [shopifySettingSchema, validValue, invalidValue]) => {
        const schema = jsonSchema.settingFrom(shopifySettingSchema)
        if (!schema) return

        it('accepts valid value', () => {
            expect(validValue).toMatchSchema(schema)
        })

        it('catches invalid value', () => {
            expect(invalidValue).not.toMatchSchema(schema)
        })
    }
)
