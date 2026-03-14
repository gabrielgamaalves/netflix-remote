
import path from "node:path"
import fs from "node:fs/promises"

async function copyFiles(sourceDir, targetDir, filePattern, options = { preserveStructure: false }) {
  const isMatchingFile = (fileName) => {
    if (Array.isArray(filePattern)) {
      const extensions = filePattern.map(ext => ext.replace(/^\./, ''));
      const regex = new RegExp(`\\.(${extensions.join('|')})$`, 'i');

      return regex.test(fileName);
    }

    return fileName === filePattern;
  };
  const findFiles = async (currentDir) => {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await findFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && isMatchingFile(entry.name)) {
        files.push(fullPath);
      }
    }
    return files;
  };

  try {
    const files = await findFiles(sourceDir);

    for (const file of files) {
      const relativePath = path.relative(sourceDir, file);
      const targetPath = options.preserveStructure
        ? path.join(targetDir, relativePath)
        : path.join(targetDir, path.basename(file));

      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      await fs.copyFile(file, targetPath);
      console.log(`Copied: ${targetPath}`);
    }

    return files;
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
}

export default copyFiles