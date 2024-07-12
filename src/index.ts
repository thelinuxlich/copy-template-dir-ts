import {
	type Dirent,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs'
import path from 'node:path'

const tokenRegex = /\{\{|\}\}/
const maxstache = (str: string, ctx: Record<string, string> = {}) => {
	const tokens = str.split(tokenRegex)
	const res = tokens.map(parse(ctx))
	return res.join('')
}

const parse = (ctx: Record<string, string>) => {
	return function parse(token: string, i: number) {
		if (i % 2 === 0) return token
		return ctx[token]
	}
}

export default function copyTemplateDir(
	srcDir: string,
	outDir: string,
	vars: Record<string, string> = {},
) {
	mkdirSync(outDir, { recursive: true })
	const createdFiles: string[] = []
	const files = readdirSync(srcDir, { recursive: true, withFileTypes: true })
	for (const file of files) {
		if (file.isDirectory()) continue
		createdFiles.push(writeFile(outDir, srcDir, vars, file))
	}
	return createdFiles
}

function writeFile(
	outDir: string,
	srcDir: string,
	vars: Record<string, string>,
	file: Dirent,
) {
	const filePath = file.parentPath
	const fullPath = `${filePath}${path.sep}${file.name}`
	const relativePath = fullPath.replace(srcDir, '')
	const relativeDirPath = filePath.replace(srcDir, '')
	const outFile = path.join(
		outDir,
		maxstache(removeUnderscore(relativePath), vars),
	)
	const fileContent = readFileSync(fullPath)
	mkdirSync(path.join(outDir, maxstache(relativeDirPath, vars)), {
		recursive: true,
	})
	writeFileSync(outFile, maxstache(fileContent.toString(), vars))
	return outFile
}

const underscoreRegex = /^_/
function removeUnderscore(filepath: string) {
	const parts = filepath.split(path.sep)
	const filename = parts.pop()?.replace(underscoreRegex, '')
	return parts.concat([filename ?? '']).join(path.sep)
}
