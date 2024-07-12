import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const tokenRegex = /\{\{|\}\}/;
const maxstache = (str, ctx = {}) => {
  const tokens = str.split(tokenRegex);
  const res = tokens.map(parse(ctx));
  return res.join("");
};
const parse = (ctx) => {
  return function parse2(token, i) {
    if (i % 2 === 0)
      return token;
    return ctx[token];
  };
};
function copyTemplateDir(srcDir, outDir, vars = {}) {
  mkdirSync(outDir, { recursive: true });
  const createdFiles = [];
  const files = readdirSync(srcDir, { recursive: true, withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory())
      continue;
    createdFiles.push(writeFile(outDir, srcDir, vars, file));
  }
  return createdFiles;
}
function writeFile(outDir, srcDir, vars, file) {
  const filePath = file.parentPath;
  const fullPath = `${filePath}${path.sep}${file.name}`;
  const relativePath = fullPath.replace(srcDir, "");
  const relativeDirPath = filePath.replace(srcDir, "");
  const outFile = path.join(
    outDir,
    maxstache(removeUnderscore(relativePath), vars)
  );
  const fileContent = readFileSync(fullPath);
  mkdirSync(path.join(outDir, maxstache(relativeDirPath, vars)), {
    recursive: true
  });
  writeFileSync(outFile, maxstache(fileContent.toString(), vars));
  return outFile;
}
const underscoreRegex = /^_/;
function removeUnderscore(filepath) {
  const parts = filepath.split(path.sep);
  const filename = parts.pop()?.replace(underscoreRegex, "");
  return parts.concat([filename ?? ""]).join(path.sep);
}

export { copyTemplateDir as default };
