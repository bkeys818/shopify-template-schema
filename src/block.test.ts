import { createBlockSchema, BlockShopifySchema } from './block'

const shopifySchema: BlockShopifySchema = {
    type: 'example-block',
    name: 'Example Block',
}

const settings: BlockShopifySchema['settings'] = [
    { type: 'number', id: 'number-setting', label: 'number-setting' },
]

const validValue = { type: shopifySchema.type }

describe('Basic block', () => {
    const schema = createBlockSchema({ ...shopifySchema })

    it("requires 'type'", () => {
        expect(validValue).toMatchSchema(schema)
        expect({}).not.toMatchSchema(schema)
    })

    it("won't accept 'settings'", () => {
        expect({ ...validValue, settings: {} }).not.toMatchSchema(schema)
    })
})

describe('Block with settings', () => {
    const schema = createBlockSchema({ ...shopifySchema, settings })

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
