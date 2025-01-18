const fs = require("fs").promises;
const path = require("path");

const stylesFolder = path.join(__dirname, "styles");
const targetFolder = path.join(__dirname, "project-dist");
const outputFile = path.join(targetFolder, "bundle.css");
async function bunleStyles() {
    await fs.rm(outputFile, {recursive: true, force: true});

    const files = await fs.readdir(stylesFolder);
    const cssFiles = [];

    for (let file of files) {
        const filePath = path.join(stylesFolder, file);
        const fileStat = await fs.stat(filePath);
        
        if (fileStat.isFile() && path.extname(file) === ".css") {
            const content = await fs.readFile(filePath, "utf-8");
            cssFiles.push(content);
        }
    }
    await fs.writeFile(outputFile, cssFiles.join("\n"));
}
bunleStyles();