#!/usr/bin/env node
import { program } from 'commander'
import { name, description, version } from '../package.json'
import { compiler, type jsonSchema } from '../dist'
import { writeFile } from 'fs/promises'
import chokidar from 'chokidar'

program
    .name(name)
    .description(description)
    .version(version)
    .argument('[dir]', 'Path to Shopify project.')
    .option('-o, --out', 'Template schema output file.')
    .option('-w, --watch', 'Watch input files.', './template.schema.json')
    .action(async (dir: string = '.', options: Options) => {
        const sectionsDir = dir + '/sections'
        const schemaFile = dir + options.out
        const schema = await compiler.createTemplateSchema(sectionsDir)
        const writeOut = (schema: jsonSchema.Template) =>
            writeFile(schemaFile, JSON.stringify(schema))
        if (options.watch) {
            const log = console.log.bind(console)
            const schemaManager = new compiler.SchemaManager(schema)
            await writeOut(schemaManager.templateSchema)
            log(`Template schema created`)
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
        } else {
            writeOut(schema)
        }
    })

program.parse()

interface Options {
    watch: boolean
    out: string
}
