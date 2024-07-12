import { ok } from 'node:assert'
import { accessSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { test } from 'node:test'
import { rimrafSync } from 'rimraf'

import copy from '../src/index.js'

const __dirname = import.meta.dirname

const checkCreatedFileNames = (names: string[]) => {
	ok(names.includes('.a'))
	ok(names.includes('c'))
	ok(names.includes('1.txt'))
	ok(names.includes('2.txt'))
	ok(names.includes('3.txt'))
	ok(names.includes('.txt'))
	ok(names.includes(`foo${path.sep}.b`))
	ok(names.includes(`foo${path.sep}d`))
	ok(names.includes(`foo${path.sep}4.txt`))
}

test('should write a bunch of files', () => {
	const inDir = path.join(__dirname, 'fixtures')
	const outDir = path.join(__dirname, '../tmp')
	const createdFiles = copy(inDir, outDir)
	ok(createdFiles.length === 10)
	const fileNames = createdFiles.map((filePath) =>
		path.relative(outDir, filePath),
	)
	checkCreatedFileNames(fileNames)
	rimrafSync(outDir)
})

test('should inject context variables strings', () => {
	const inDir = path.join(__dirname, 'fixtures')
	const outDir = path.join(__dirname, '../tmp')
	copy(inDir, outDir, { foo: 'bar' })
	const file = path.join(outDir, '1.txt')
	const fileContent = readFileSync(file).toString()
	ok(fileContent === 'hello bar sama')
	rimrafSync(outDir)
})

test('should inject context variables strings into filenames', () => {
	const inDir = path.join(__dirname, 'fixtures')
	const outDir = path.join(__dirname, '../tmp')
	copy(inDir, outDir, { foo: 'bar' })
	readdirSync(outDir, { recursive: true })
	const file = path.join(outDir, 'bar.txt')
	accessSync(file)
	rimrafSync(outDir)
})

test('should inject context variables strings into directory names', () => {
	const inDir = path.join(__dirname, 'fixtures')
	const outDir = path.join(__dirname, '../tmp')
	copy(inDir, outDir, { foo: 'bar' })
	readdirSync(outDir, { recursive: true })
	const dir = path.join(outDir, 'bar')
	accessSync(dir)
	rimrafSync(outDir)
})
