#!/usr/bin/env node
import { program } from 'commander'
import { name, description, version } from '../package.json'

program.name(name).description(description).version(version)

program.parse()
