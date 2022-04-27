import { jsonSchema } from '.'
import { makeTypeFrom } from './transformer/section'
import lexer from './lexer'
import { readdir, readFile } from 'fs/promises'

export async function createTemplateSchema(sectionsDirPath: string) {
    const sections: Parameters<typeof jsonSchema['templateFrom']>[0] = {}
    for (const file of await readdir(sectionsDirPath)) {
        const content = await readFile(`${sectionsDirPath}/${file}`, 'utf8')
        sections[file] = lexer(content)
    }
    return jsonSchema.templateFrom(sections)
}

export class SchemaManager {
    constructor(readonly templateSchema: jsonSchema.Template) {}

    /** If schema under name already exist, it will be updated. */
    async addSection(filePath: string) {
        const section = lexer(await readFile(filePath, 'utf8'))
        this.modifySection({
            fileName: filePath,
            method: 'add',
            ifInSchemas: (schemas, i) => {
                schemas[i] = jsonSchema.sectionFrom(filePath, section)
            },
            ifNotInSchemas: schemas => {
                schemas.push(jsonSchema.sectionFrom(filePath, section))
            },
            ifSchemasEmpty: () => {
                this.setSectionSchemas([
                    jsonSchema.sectionFrom(filePath, section),
                ])
            },
        })
    }

    removeSection(fileName: string) {
        this.modifySection({
            fileName,
            method: 'rename',
            ifInSchemas: (schemas, i) => {
                schemas.splice(i, 1)
            },
        })
    }

    private modifySection({
        fileName,
        method,
        ifInSchemas,
        ifNotInSchemas,
        ifSchemasEmpty,
    }: ModifyParams) {
        const type = makeTypeFrom(fileName)
        if (this.sectionSchemas) {
            const index = this.sectionSchemas.findIndex(
                schema => schema.properties.type.const === type
            )
            if (index !== -1) {
                if (ifInSchemas) return ifInSchemas(this.sectionSchemas, index)
            } else if (ifNotInSchemas)
                return ifNotInSchemas(this.sectionSchemas)
        } else {
            if (ifSchemasEmpty) return ifSchemasEmpty()
        }
        const error = new TemplateSchemaError(method)
        error.type = type
        error.empty = Boolean(this.sectionSchemas)
        throw error
    }

    private get sectionSchemas(): SectionSchemas | void {
        const schema =
            this.templateSchema.properties.sections.additionalProperties
        if (schema) {
            return schema.anyOf
        }
    }
    private setSectionSchemas(value: jsonSchema.Section[] | undefined) {
        this.templateSchema.properties.sections.additionalProperties = value
            ? jsonSchema.factor.anyOf(value)
            : false
    }
}

type SectionSchemas = Exclude<
    jsonSchema.Template['properties']['sections']['additionalProperties'],
    false
>['anyOf']

interface ModifyParams {
    fileName: string
    method: 'add' | 'update' | 'rename' | 'remove'
    ifInSchemas?: (schemas: SectionSchemas, index: number) => void
    ifNotInSchemas?: (schemas: SectionSchemas) => void
    ifSchemasEmpty?: () => void
}

class TemplateSchemaError extends Error {
    readonly name = 'TemplateSchemaError'
    constructor(readonly method: 'add' | 'update' | 'rename' | 'remove') {
        super()
    }
    empty = false
    type?: string

    get message() {
        const section = (this.type ? this.type + ' ' : '') + 'section'
        let msg = `Can't ${this.method} ${section}!`
        if (this.empty) {
            msg += '. There are no sections'
        } else {
            msg += `Section ${
                this.method === 'add' ? 'already' : "doesn't"
            } exist`
        }
        msg += ' in the schema!'
        return msg
    }
}
