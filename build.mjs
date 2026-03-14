const argv = new Map(
  process.argv
    .slice(2)
    .map(arg => {
      const a = arg.split("=")
      if (!a.hasOwnProperty(1) || a?.[1].length < 1) a[1] = true
      return a
    })
)

import esbuild from "esbuild"
import path from "node:path"

import copyFiles from "./scripts/copy-files.mjs"
import compactReleases from "./scripts/compact-releases.mjs"

/** * @param {import("node_modules/esbuild/lib/main").BuildOptions} options */
async function contextOrBuild(options) {
  const __ambient = argv.get("--ambient")
  const __type = (!__ambient || __ambient === "build") ? "build" : "context"
  const ambient = (__type === "build") ? esbuild.build : esbuild.context

  try {
    const run = await ambient(options)
    const runners = []

    if (__type === "context") {
      if (argv.has("--watch")) {
        const delay = Number(argv.get("--watch")) || 0

        runners.push(run.watch({ delay }))
      };

      if (argv.has("--serve")) {
        const port = Number(argv.get("--serve")) || undefined
        const servedir = argv.get("--servedir")

        runners.push(run.serve({ port, servedir }))
      }
    }

    await Promise.all(runners)
    return run
  }
  catch (err) {
    console.error('Erro:', err.message);
  }
}

const optionsBuild = {
  bundle: true,
  format: "esm",
  alias: { "@": path.resolve("src") },
  loader: {
    ".css": "text",
    ".svg": "text"
  }
}

await Promise.all([
  copyFiles("./src/", "dist/public", [
    ".jpg",
    ".png",
    ".svg",
    ".css"
  ], { preserveStructure: true }),

  copyFiles("./src/", "dist/", [
    ".json",
  ]),

  contextOrBuild({
    ...optionsBuild,
    entryPoints: ["src/core/index.js"],
    outfile: "dist/core.js"
    // globalName: "NetflixRemoteCore", -> iife
  })
])

// pos-build ->
if (argv.has("--compact")) {
  try {
    const fileName = `${argv.get("--compact-filename") || path.basename(import.meta.dirname)}.zip`;
    compactReleases("./releases/", fileName)
  } catch (err) {
    console.error('Erro:', err.message);
  }
}