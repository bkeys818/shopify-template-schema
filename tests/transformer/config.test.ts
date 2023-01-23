import { jsonSchema } from '../../src'
import { settingShopifySchema } from './utils'

const validValue = { current: {} }
const settings = [settingShopifySchema]

describe('Basic config', () => {
    const schema = jsonSchema.configFrom([])

    it("requires 'current' (string)", () => {
        expect(validValue).toMatchSchema(schema)
        expect({}).not.toMatchSchema(schema)
    })

    it("requires 'current' (preset)", () => {
        expect({ current: '', presets: {} }).toMatchSchema(schema)
        expect({ current: '' }).not.toMatchSchema(schema)
    })
})

it('Config with sections', () => {
    const templateSchemaPath = 'template.schema.json'
    expect(jsonSchema.configFrom([], templateSchemaPath)).toHaveProperty(
        'definitions.settings.properties.sections.$ref',
        `${templateSchemaPath}#/definitions/sections`
    )
})

describe('Config with sections', () => {
    const schema = jsonSchema.configFrom([{ name: 'default', settings }])

    it("accepts 'settings'", () => {
        expect({
            ...validValue,
            settings: { [settings[0].id]: 0 },
        }).toMatchSchema(schema)
    })

    it("'setting' properties are optional", () => {
        expect({ ...validValue, settings: {} }).toMatchSchema(schema)
    })
})
