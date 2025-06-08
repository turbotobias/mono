#!/usr/bin/env bun

import { promises as fs } from 'fs'
import { join } from 'path'
import { stdin, stdout } from 'process'

interface TArgs {
    type: 'package' | 'app' | null
    name: string | null
}

/** parse command line arguments */
function parse_args(): TArgs {
    const [, , type_arg, name_arg] = process.argv

    let type: TArgs['type'] = null
    if (type_arg === 'p' || type_arg === 'package') {
        type = 'package'
    } else if (type_arg === 'a' || type_arg === 'app') {
        type = 'app'
    }

    return {
        type,
        name: name_arg || null
    }
}

/** ask user for input via terminal */
function ask_input(question: string): Promise<string> {
    return new Promise((resolve) => {
        stdout.write(question + ' ')
        stdin.once('data', (data: Buffer) => {
            resolve(data.toString().trim())
        })
    })
}

/** show available options */
function show_help() {
    console.log(`
bun gen <type> [name]

Types:
  p, package  - copy package template to packages/[name]
  a, app      - copy app template to apps/[name]
	`.trim())
}

/** check if directory exists */
async function dir_exists(path: string): Promise<boolean> {
    try {
        const stat = await fs.stat(path)
        return stat.isDirectory()
    } catch {
        return false
    }
}

/** copy directory recursively */
async function copy_dir(source: string, target: string): Promise<void> {
    await fs.mkdir(target, { recursive: true })

    const entries = await fs.readdir(source, { withFileTypes: true })

    await Promise.all(entries.map(async (entry) => {
        const source_path = join(source, entry.name)
        const target_path = join(target, entry.name)

        if (entry.isDirectory()) {
            await copy_dir(source_path, target_path)
        } else {
            await fs.copyFile(source_path, target_path)
        }
    }))
}

/** update package.json name field */
async function update_package_name(package_path: string, new_name: string, type: 'package' | 'app'): Promise<void> {
    try {
        const package_json_path = join(package_path, 'package.json')
        const content = await fs.readFile(package_json_path, 'utf-8')
        const pkg = JSON.parse(content)

        // update package name based on type
        if (type === 'package') {
            pkg.name = `@mono/${new_name}`
        } else {
            pkg.name = `@mono/${new_name}`
        }

        await fs.writeFile(package_json_path, JSON.stringify(pkg, null, 2) + '\n')
        console.log(`✅ Updated package name to: ${pkg.name}`)
    } catch (error) {
        console.log(`⚠️  Could not update package.json: ${error}`)
    }
}

async function main() {
    const args = parse_args()
    let { type, name } = args

    // get type if missing
    if (!type) {
        console.log('Available types:')
        console.log('  p, package - copy package template')
        console.log('  a, app     - copy app template')
        console.log()

        const input = await ask_input('Select type (p/a):')
        if (input === 'p' || input === 'package') {
            type = 'package'
        } else if (input === 'a' || input === 'app') {
            type = 'app'
        } else {
            console.log('❌ Invalid type. Use p/package or a/app')
            process.exit(1)
        }
    }

    // get name if missing
    if (!name) {
        name = await ask_input('Enter name:')
        if (!name) {
            console.log('❌ Name is required')
            process.exit(1)
        }
    }

    // validate name format
    if (!/^[a-z0-9-]+$/.test(name)) {
        console.log('❌ Name must be lowercase with hyphens only (e.g., my-package)')
        process.exit(1)
    }

    const source_dir = type === 'package'
        ? 'templates/packages/utils'
        : 'templates/apps/rwsdk'

    const target_dir = type === 'package'
        ? `packages/${name}`
        : `apps/${name}`

    // check if source exists
    if (!(await dir_exists(source_dir))) {
        console.log(`❌ Source template not found: ${source_dir}`)
        process.exit(1)
    }

    // check if target already exists
    if (await dir_exists(target_dir)) {
        console.log(`❌ Target already exists: ${target_dir}`)
        process.exit(1)
    }

    console.log(`📂 Copying ${type} template...`)
    console.log(`   From: ${source_dir}`)
    console.log(`   To:   ${target_dir}`)

    try {
        await copy_dir(source_dir, target_dir)
        await update_package_name(target_dir, name, type)

        console.log(`✅ Successfully created ${type}: ${name}`)
        console.log(`   Location: ${target_dir}`)
        console.log()
        console.log('Next steps:')
        console.log('  bun install')
        console.log('  bun check')

    } catch (error) {
        console.log(`❌ Failed to copy template: ${error}`)
        process.exit(1)
    }
}

// run if called directly
if (import.meta.main) {
    main().catch(console.error)
}