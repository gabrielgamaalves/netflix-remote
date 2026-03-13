const argv = process.argv.slice(2)
const hasArg = (arg) => argv.includes(arg)

import path from "node:path"
import { build } from "esbuild"

import fs from "fs/promises"

async function fs_exists(path) {
  try {
    await fs.access(path)
    return true
  }
  catch (err) {
    return false
  }
}

async function copyFile(dir, outputDir, fileNameOrEndsWith, options = { dirIncluide: false }) {
  async function listDir(dir, files) {
    const isQueryFile = (pathItem) => {
      if (Array.isArray(fileNameOrEndsWith)) {
        const
          endsWithJoin = fileNameOrEndsWith.map(v => v.replace(".", "")).join("|"),
          regExpJoin = (fileNameOrEndsWith.length > 1) ? `.(${endsWithJoin})` : `.${endsWithJoin}`;

        return !!(pathItem.match(new RegExp(`\\${regExpJoin}$`)))
      }

      return !!(pathItem.split("\\").pop() === fileNameOrEndsWith)
    }

    if (!files) files = [];
    const dirItems = await fs.readdir(path.resolve(dir));

    for (const item in dirItems) {
      const pathItem = path.join(dir, dirItems[item])
      const stat = await fs.stat(pathItem);

      if (stat.isDirectory()) await listDir(pathItem, files);
      else if (isQueryFile(pathItem)) files.push(pathItem)
    }

    return files;
  }

  const listFiles = await listDir(dir)
  for (const file of listFiles) {
    const dest = options?.dirIncluide ? path.join(outputDir, ...file.split("\\").slice(1)) : path.join(outputDir, file.split("\\").pop())

    if (!(await fs_exists(dest, fs.constants.F_OK))) {
      fs.mkdir(path.join(...dest.split("\\").slice(0, -1)), { recursive: true })
    }

    await fs.copyFile(file, dest)
    console.log(dest)
  }

  return listFiles
}

const shared = {
  bundle: true,
  format: "esm",
  alias: { "@": path.resolve("src") },
  loader: {
    ".css": "text",
    ".svg": "text"
  }
}

await Promise.all([
  copyFile("./src/", "dist/public", [
    ".jpg",
    ".png",
    ".svg",
    ".css"
  ]),

  copyFile("./src/", "dist/", [
    ".json",
  ]),

  build({
    ...shared,
    entryPoints: ["src/core/index.js"],
    // globalName: "NetflixRemoteCore",
    outfile: "dist/core.js"
  }),

  // build({
  //   ...shared,
  //   entryPoints: ["src/injected/index.js"],
  //   outfile: "dist/injected.js"
  // })
])