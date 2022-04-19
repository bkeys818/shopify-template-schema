import { jsonSchema } from '../../src'
import { section } from './utils'

const schema = jsonSchema.templateFrom({
    [section.fileName]: section.shopifySchema,
})

test('template with no sections', () => {
    expect(() => {
        jsonSchema.templateFrom({})
    }).not.toThrow()
})

test("requires 'sections' and 'order'", () => {
    const sections = { section: { type: section.type } }
    const order = Object.keys(sections)
    expect({ sections, order }).toMatchSchema(schema)
    expect({ sections }).not.toMatchSchema(schema)
    expect({ order }).not.toMatchSchema(schema)
    expect({}).not.toMatchSchema(schema)
})

test("default 'sections' limit", () => {
    const sections = Object.fromEntries(
        [...Array(20).keys()].map(num => [
            'section-' + (num + 1).toString(),
            { type: section.type },
        ])
    )
    let order = Object.keys(sections)
    expect({ sections, order }).toMatchSchema(schema)
    sections['section-21'] = { type: section.type }
    order = Object.keys(sections)
    expect({ sections, order }).not.toMatchSchema(schema)
})
