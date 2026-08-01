
// -> Modes
//  Dev:   "node esbuild.config.js --dev",
//  Watch: "node esbuild.config.js --watch"

import esbuild from "esbuild"

const args = process.argv.slice(2);

const isDev = args.includes("--dev");
const isWatch = args.includes("--watch");

/** @type {import("esbuild").BuildOptions} */
const buildOptions = {
  globalName: "NetflixRemote",

  entryPoints: ["src/index.ts"],
  outfile: "dist/netflix-remote.js",

  bundle: true,
  minify: (!isDev && !isWatch),
  sourcemap: true,
  
  platform: "browser",
  target: "es2020",
  format: "iife",
  
  logLevel: "info",
};

async function run() {
  try {
    if (isWatch) {
      const context = await esbuild.context(buildOptions);
      await context.watch();

      console.log("👀 Watching for changes...");
    }

    else {
      await esbuild.build(buildOptions);
      console.log(`✅ ${minify ? "production" : "development"} build completed: ${buildOptions.outfile}`);
    }
  } catch (err) {
    console.error("❌ Erro no build:", err);
    process.exit(1);
  }
}

run();