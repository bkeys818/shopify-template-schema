import {
    createSectionSchema,
    SectionShopifySchema,
    BlockShopifySchema,
} from '.'

const block = (type: string): BlockShopifySchema => ({
    type,
    name: type + ' block',
})

const sectionType = 'example-section'
const fileName = sectionType + '.liquid'
const shopifySchema: SectionShopifySchema = { name: 'Section Example' }
const blocks: NonNullable<SectionShopifySchema['blocks']> = [
    block('one'),
    block('two'),
    block('three'),
]
const settings: SectionShopifySchema['settings'] = [
    { type: 'number', id: 'number-setting', label: 'number-label' },
]

describe('Section with no schema', () => {
    const schema = createSectionSchema(fileName)

    it("requires 'type'", () => {
        expect({ type: sectionType }).toMatchSchema(schema)
        expect({}).not.toMatchSchema(schema)
    })
})

describe('Basic section', () => {
    const schema = createSectionSchema(fileName, shopifySchema)

    it("requires 'type'", () => {
        expect({ type: sectionType }).toMatchSchema(schema)
        expect({}).not.toMatchSchema(schema)
    })

    it("won't accept 'settings' or 'blocks'", () => {
        expect({ type: sectionType, settings: {} }).not.toMatchSchema(schema)
        expect({ type: sectionType, blocks: {} }).not.toMatchSchema(schema)
    })
})

describe('Section with settings', () => {
    const schema = createSectionSchema(fileName, { ...shopifySchema, settings })

    it("accepts 'settings'", () => {
        expect({
            type: sectionType,
            settings: { [settings[0].id]: 0 },
        }).toMatchSchema(schema)
    })

    it("'settings' is optional", () => {
        expect({ type: sectionType }).toMatchSchema(schema)
    })

    it("'setting' properties are optional", () => {
        expect({ type: sectionType, settings: {} }).toMatchSchema(schema)
    })
})

describe('Section with blocks', () => {
    const schema = createSectionSchema(fileName, { ...shopifySchema, blocks })

    it("accepts only 'blocks' and 'block_order' together", () => {
        const validValue = {
            type: sectionType,
            blocks: { block1: { type: 'one' }, block2: { type: 'two' } },
            block_order: ['block2', 'block1'],
        }

        expect(validValue).toMatchSchema(schema)
        expect({
            type: validValue.type,
            blocks: validValue.blocks,
        }).not.toMatchSchema(schema)
        expect({
            type: validValue.type,
            block_order: validValue.block_order,
        }).not.toMatchSchema(schema)
    })

    it("'blocks' and 'block_order' together are optional", () => {
        expect({ type: sectionType }).toMatchSchema(schema)
    })

    it("'blocks' properties are optional", () => {
        expect({
            type: sectionType,
            blocks: {},
            block_order: [],
        }).toMatchSchema(schema)
    })

    function createBlocks(n: number) {
        return Object.fromEntries(
            [...Array(n).keys()].map(num => [
                'block-' + (num + 1).toString(),
                { type: blocks[0].type },
            ])
        )
    }

    it("custom 'max_blocks' limit", () => {
        const max_blocks = 15
        const schema = createSectionSchema(fileName, {
            ...shopifySchema,
            blocks,
            max_blocks,
        })
        const blocksValue = createBlocks(max_blocks)
        const value = {
            type: sectionType,
            blocks: blocksValue,
            block_order: Object.keys(blocksValue),
        }
        expect(value).toMatchSchema(schema)
        const newBlockKey = 'block-16'
        blocksValue[newBlockKey] = { type: blocks[0].type }
        value.block_order.push(newBlockKey)
        expect(value).not.toMatchSchema(schema)
    })

    it("default 'max_blocks' limit", () => {
        const blocksValue = createBlocks(16)
        const value = {
            type: sectionType,
            blocks: blocksValue,
            block_order: Object.keys(blocksValue),
        }
        expect(value).toMatchSchema(schema)
        const newBlockKey = 'block-17'
        blocksValue[newBlockKey] = { type: blocks[0].type }
        value.block_order.push(newBlockKey)
        expect(value).not.toMatchSchema(schema)
    })
})
