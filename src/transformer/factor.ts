export function anyOf<T extends SchemaWithRequiredTypeProp>(
    schemas: T[]
): AnyOf<T> {
    return {
        type: 'object',
        required: ['type'],
        anyOf: schemas.map(({ required: _, type: __, ...schema }) => schema),
    }
}

export type AnyOf<T extends SchemaWithRequiredTypeProp> = {
    type: 'object'
    required: ['type']
    anyOf: Omit<T, 'type' | 'required'>[]
}

interface SchemaWithRequiredTypeProp {
    type: 'object'
    required: ['type']
}
