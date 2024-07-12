# copy-template-dir-ts

This is a rewrite of [copy-template-dir](https://github.com/yoshuawuyts/copy-template-dir) with TypeScript and ESM support.

High throughput template dir writes. Supports variable injection using the
mustache `{{ }}` syntax.

## Installation
```sh
$ npm install copy-template-dir-ts
```

## Usage
```js
import copy from 'copy-template-dir-ts'
import path from 'path'

const vars = { foo: 'bar' }
const inDir = path.join(process.cwd(), 'templates')
const outDir = path.join(process.cwd(), 'dist')

const createdFiles = copy(inDir, outDir, vars)
for (const file of createdFiles) {
  console.log(`Created ${file}`)
}
console.log('done!')
```

## API
### copyTemplateDir(templateDir, targetDir, vars)
Copy a directory of files over to the target directory, and inject the files
with variables. Takes the following arguments:
- __templateDir__: The directory that holds the templates. Filenames prepended
  with a `_` will have it removed when copying. Dotfiles need to be prepended
  with a `_`. Files and filenames are populated with variables using the
  `{{varName}}` syntax.
- __targetDir__: the output directory
- __vars__: An object with variables that are injected into the template files
  and file names.