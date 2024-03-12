// Build script. Run this to minify the code and bundle it in a zip, as to be upload-ready!
import { minify } from 'minify';
import { glob } from 'glob';
import archiver from 'archiver';
import * as fs from 'fs';

// Could be a cool npm package idea ngl

const manifest = JSON.parse(await fs.promises.readFile("manifest.json"));
const firefoxExtra = {
    "browser_specific_settings": {
        "gecko": {
            "id": "browser@breakout.com",
            "strict_min_version": "42.0"
        }
    }
};

await build("Chrome", `build/chrome-browser-breakout-${manifest.version}.zip`);
await build("Firefox", `build/firefox-browser-breakout-${manifest.version}.zip`, firefoxExtra);


async function build(platform, outPath, manifestExtra = {}) {
    console.log(`Starting ${platform} Zip creation`);
    // Delete existing zip
    fs.unlink(outPath, (err) => {
        if (!err) console.log(`Old ${platform} Zip was deleted`);
    });

    // Setup for zip
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip');
    // Files to minify
    const files = await glob("./src/**/*.*");

    try {
        // minify files and append to zip
        for (const file of files) {
            const data = await minify(file);
            archive.append(data, { name: file });
        }
    } catch (error) {
        console.error(error);
    }

    // Create the final manifest JSON
    let buildManifest = manifest;
    if (Object.keys(manifestExtra).length !== 0) {
        buildManifest = { ...manifest, ...manifestExtra };
    }

    // Add manifest.json and assets
    archive.append(JSON.stringify(buildManifest), { name: "manifest.json" });
    archive.file("assets/icon16.png");
    archive.file("assets/icon48.png");
    archive.file("assets/icon128.png");

    // Create zip
    archive.pipe(output);
    archive.finalize();

    console.log(`Finished making ${platform} Zip!`);
}
