#!/usr/bin/env node
import { program } from 'commander'
import { name, description, version } from '../package.json'
import { compiler, type jsonSchema } from '../dist'
import { writeFile, copyFile } from 'fs/promises'
import * as path from 'path'
import chokidar from 'chokidar'

const configSettingsSchemaPath = path.resolve(
    __filename,
    '../../static/settings_schema.schema.json'
)

program
    .name(name)
    .description(description)
    .version(version)
    .argument('[dir]', 'Path to Shopify project.')
    .option('-o, --out <path>', 'Template schema output file.')
    .option('-w, --watch', 'Watch input files.')
    .action(async (dir: string = '.', options: Options) => {
        const sectionsDir = path.resolve(dir, './sections')
        const configDir = path.resolve(dir, './config')

        const templateSchemaFile =
            options.out ?? path.resolve(dir, './template.schema.json')
        const templateSchema = await compiler.createTemplateSchema(sectionsDir)
        const writeOut = (schema: jsonSchema.Template) =>
            writeFile(templateSchemaFile, JSON.stringify(schema), { flag: 'w' })

        const configSchema = configDir + '/settings_schema.json'
        const writeOutConfig = async () =>
            await writeFile(
                configDir + '/settings_data.schema.json',
                JSON.stringify(
                    await compiler.createConfigSchema(
                        configSchema,
                        templateSchemaFile
                    )
                ),
                { flag: 'w' }
            )

        await Promise.all([
            writeOut(templateSchema),
            writeOutConfig(),
            copyFile(
                configSettingsSchemaPath,
                configDir + '/settings_schema.schema.json'
            ),
        ])

        if (options.watch) {
            const log = console.log.bind(console)
            log(`Template schema created`)
            const schemaManager = new compiler.SchemaManager(templateSchema)
            chokidar
                .watch(sectionsDir + '/*', { ignoreInitial: true })
                .on('add', async path => {
                    await schemaManager.addSection(path)
                    await writeOut(schemaManager.templateSchema).then(() =>
                        console.log(`Added ${path} to template schema`)
                    )
                })
                .on('change', async path => {
                    await schemaManager.addSection(path)
                    await writeOut(schemaManager.templateSchema).then(() =>
                        console.log(`Updated ${path} to template schema`)
                    )
                })
                .on('unlink', async path => {
                    schemaManager.removeSection(path)
                    await writeOut(schemaManager.templateSchema).then(() =>
                        console.log(`Removed ${path} to template schema`)
                    )
                })
            chokidar
                .watch(configSchema, {
                    ignoreInitial: true,
                })
                .on('change', () => writeOutConfig())
        }
    })

program.parse()

interface Options {
    watch: boolean
    out?: string
}
