import path from "node:path"
import fs from "node:fs/promises"

import AdmZip from "adm-zip";

async function compactReleases(dirReleases, fileName) {
  try {
    const zip = new AdmZip();
    const zipPath = path.join(path.resolve(dirReleases), fileName);

    zip.addLocalFolder('./dist');
    zip.writeZip(zipPath);

    // log:
    const stats = await fs.stat(zipPath);
    const logEntry = `[${new Date().toISOString()}] ${fileName} criatedAt - ${new Date().toLocaleString()}\n`;
    await fs.appendFile('./releases/build-log.txt', logEntry);
  }
  catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
}

export default compactReleases