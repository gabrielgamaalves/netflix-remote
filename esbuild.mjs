import { build } from "esbuild"

const netflixRemoteCore = {
  entryPoints: ["src/core/index.js"],
  bundle: true,
  format: "iife",
  globalName: "NetflixRemoteCore",
  alias: { "@": "src/core" }
}

await build({
  ...netflixRemoteCore,
  outfile: "dist/core.js"
})

await build({
  ...netflixRemoteCore,
  minify: true,
  outfile: "dist/core.min.js"
})