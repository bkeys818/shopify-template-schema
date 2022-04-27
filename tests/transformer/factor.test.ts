import { jsonSchema } from '../../src'
import { basicBlock } from './utils'

const blockTypes = ['one', 'two'] as const

const schemas: jsonSchema.Block[] = blockTypes.map(type =>
    jsonSchema.blockFrom(basicBlock(type))
)

test(jsonSchema.factor.anyOf.name, () => {
    expect({ type: blockTypes[0] }).toMatchSchema({ anyOf: schemas })
    expect({ type: blockTypes[0] }).toMatchSchema(
        jsonSchema.factor.anyOf(schemas)
    )
})
