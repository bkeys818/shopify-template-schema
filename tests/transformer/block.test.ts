import { jsonSchema } from '../../src'
import { blockShopifySchema, settingShopifySchema } from './utils'

const settings = [settingShopifySchema]
const validValue = { type: blockShopifySchema.type }

describe('Basic block', () => {
    const schema = jsonSchema.blockFrom({ ...blockShopifySchema })

    it("requires 'type'", () => {
        expect(validValue).toMatchSchema(schema)
        expect({}).not.toMatchSchema(schema)
    })

    it("won't accept 'settings'", () => {
        expect({ ...validValue, settings: {} }).not.toMatchSchema(schema)
    })
})

describe('Block with settings', () => {
    const schema = jsonSchema.blockFrom({ ...blockShopifySchema, settings })

    it("accepts 'settings'", () => {
        expect({
            ...validValue,
            settings: { [settings[0].id]: 0 },
        }).toMatchSchema(schema)
    })

    it("'settings' is optional", () => {
        expect({ ...validValue }).toMatchSchema(schema)
    })

    it("'setting' properties are optional", () => {
        expect({ ...validValue, settings: {} }).toMatchSchema(schema)
    })
})
