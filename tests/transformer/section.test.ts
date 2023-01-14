import { jsonSchema } from '../../src'
import { makeTypeFrom } from '../../src/transformer/section'
import { basicBlock, section, settingShopifySchema } from './utils'

describe(makeTypeFrom, () => {
    const { filePath, type } = section
    it('extracts type from file path', () => {
        expect(makeTypeFrom(filePath)).toBe(type)
    })
})

const blocks = ['one', 'two', 'three'].map(basicBlock)
const settings = [settingShopifySchema]

describe('Section with no schema', () => {
    const schema = jsonSchema.sectionFrom(section.filePath)

    it("requires 'type'", () => {
        expect({ type: section.type }).toMatchSchema(schema)
        expect({}).not.toMatchSchema(schema)
    })
})

describe('Basic section', () => {
    const schema = jsonSchema.sectionFrom(
        section.filePath,
        section.shopifySchema
    )

    it("requires 'type'", () => {
        expect({ type: section.type }).toMatchSchema(schema)
        expect({}).not.toMatchSchema(schema)
    })

    it("won't accept 'settings' or 'blocks'", () => {
        expect({ type: section.type, settings: {} }).not.toMatchSchema(schema)
        expect({ type: section.type, blocks: {} }).not.toMatchSchema(schema)
    })
})

describe('Section with settings', () => {
    const schema = jsonSchema.sectionFrom(section.filePath, {
        ...section.shopifySchema,
        settings: [settingShopifySchema],
    })

    it("accepts 'settings'", () => {
        expect({
            type: section.type,
            settings: { [settings[0].id]: 0 },
        }).toMatchSchema(schema)
    })

    it("'settings' is optional", () => {
        expect({ type: section.type }).toMatchSchema(schema)
    })

    it("'setting' properties are optional", () => {
        expect({ type: section.type, settings: {} }).toMatchSchema(schema)
    })
})

describe('Section with blocks', () => {
    const schema = jsonSchema.sectionFrom(section.filePath, {
        ...section.shopifySchema,
        blocks,
    })

    it("accepts only 'blocks' and 'block_order' together", () => {
        const validValue = {
            type: section.type,
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
        expect({ type: section.type }).toMatchSchema(schema)
    })

    it("'blocks' properties are optional", () => {
        expect({
            type: section.type,
            blocks: {},
            block_order: [],
        }).toMatchSchema(schema)
    })

    function createBlocks(n: number) {
        return Object.fromEntries(
            [...Array(n).keys()].map(num => [
                'basicBlock-' + (num + 1).toString(),
                { type: blocks[0].type },
            ])
        )
    }

    it("custom 'max_blocks' limit", () => {
        const max_blocks = 15
        const schema = jsonSchema.sectionFrom(section.filePath, {
            ...section.shopifySchema,
            blocks,
            max_blocks,
        })
        const blocksValue = createBlocks(max_blocks)
        const value = {
            type: section.type,
            blocks: blocksValue,
            block_order: Object.keys(blocksValue),
        }
        expect(value).toMatchSchema(schema)
        const newBlockKey = 'basicBlock-16'
        blocksValue[newBlockKey] = { type: blocks[0].type }
        value.block_order.push(newBlockKey)
        expect(value).not.toMatchSchema(schema)
    })

    it("default 'max_blocks' limit", () => {
        const blocksValue = createBlocks(16)
        const value = {
            type: section.type,
            blocks: blocksValue,
            block_order: Object.keys(blocksValue),
        }
        expect(value).toMatchSchema(schema)
        const newBlockKey = 'basicBlock-17'
        blocksValue[newBlockKey] = { type: blocks[0].type }
        value.block_order.push(newBlockKey)
        expect(value).not.toMatchSchema(schema)
    })
})
