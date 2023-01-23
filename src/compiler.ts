import { jsonSchema } from '.'
import { makeTypeFrom } from './transformer/section'
import lexer from './lexer'
import { readdir, readFile } from 'fs/promises'

export async function createConfigSchema(
    settingsSchemaPath: string,
    templateSchemaPath?: string
) {
    return jsonSchema.configFrom(
        JSON.parse(await readFile(settingsSchemaPath, 'utf8')),
        templateSchemaPath
    )
}

export async function createTemplateSchema(sectionsDirPath: string) {
    const sections: Parameters<typeof jsonSchema['templateFrom']>[0] = {}
    for (const file of await readdir(sectionsDirPath)) {
        const filePath = `${sectionsDirPath}/${file}`
        const content = await readFile(filePath, 'utf8')
        sections[filePath] = lexer(content)
    }
    return jsonSchema.templateFrom(sections)
}

export class SchemaManager {
    constructor(readonly templateSchema: jsonSchema.Template) {}

    /** If schema under name already exist, it will be updated. */
    async addSection(filePath: string) {
        const section = lexer(await readFile(filePath, 'utf8'))
        this.modifySection({
            filePath: filePath,
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

    removeSection(filePath: string) {
        this.modifySection({
            filePath,
            method: 'rename',
            ifInSchemas: (schemas, i) => {
                if (schemas.length == 1) this.setSectionSchemas(undefined)
                else schemas.splice(i, 1)
            },
        })
    }

    private modifySection({
        filePath,
        method,
        ifInSchemas,
        ifNotInSchemas,
        ifSchemasEmpty,
    }: ModifyParams) {
        const type = makeTypeFrom(filePath)
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
            this.templateSchema.definitions.sections.additionalProperties
        if (schema) {
            return schema.anyOf
        }
    }
    private setSectionSchemas(value: jsonSchema.Section[] | undefined) {
        this.templateSchema.definitions.sections.additionalProperties = value
            ? jsonSchema.factor.anyOf(value)
            : false
    }
}

type SectionSchemas = Exclude<
    jsonSchema.Template['definitions']['sections']['additionalProperties'],
    false
>['anyOf']

interface ModifyParams {
    filePath: string
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
