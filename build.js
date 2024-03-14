// Build script. Run this to minify the code and bundle it in a zip, as to be upload-ready!
import { minify } from 'minify';
import { glob } from 'glob';
import archiver from 'archiver';
import * as fs from 'fs';

// Could be a cool npm package idea ngl

const version = JSON.parse(await fs.promises.readFile("manifest-chrome.json")).version;

await build("chrome", `build/chrome-browser-breakout-${version}.zip`);
await build("firefox", `build/firefox-browser-breakout-${version}.zip`);


async function build(platform, outPath) {
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

    // Add manifest.json and assets
    archive.append(fs.createReadStream(`manifest-${platform}.json`), { name: "manifest.json"});
    archive.file("assets/icon16.png");
    archive.file("assets/icon48.png");
    archive.file("assets/icon128.png");

    // Create zip
    archive.pipe(output);
    archive.finalize();

    console.log(`Finished making ${platform} Zip!`);
}
