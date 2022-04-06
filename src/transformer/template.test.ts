import { jsonSchema, type shopify } from '..'

const sectionType = 'example-section'
const fileName = sectionType + '.liquid'
const shopifySchema: shopify.SectionSchema = { name: 'Section Example' }
const schema = jsonSchema.createTemplateSchema({ [fileName]: shopifySchema })

test('template with no sections', () => {
    expect(() => {
        jsonSchema.createTemplateSchema({})
    }).not.toThrow()
})

test("requires 'sections' and 'order'", () => {
    const sections = { section: { type: sectionType } }
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
            { type: sectionType },
        ])
    )
    let order = Object.keys(sections)
    expect({ sections, order }).toMatchSchema(schema)
    sections['section-21'] = { type: sectionType }
    order = Object.keys(sections)
    expect({ sections, order }).not.toMatchSchema(schema)
})
