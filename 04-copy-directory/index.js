const fs = require("fs").promises;
const path = require("path");

const sourceDirectory = path.join(__dirname, "files");
const targetDirectory = path.join(__dirname, "files-copy");


async function copyFiles() {
    try {
        await fs.rm(targetDirectory, {recursive: true, force: true});
        
        await fs.mkdir(targetDirectory, {recursive: true});

        const files = await fs.readdir(sourceDirectory);

        for (let file of files) {
            const srcFile = path.join(sourceDirectory, file);
            const destFile = path.join(targetDirectory, file);
            await fs.copyFile(srcFile, destFile);
        }
    } catch (error) {
        console.error(error)
    }
}
copyFiles();