const fs = require("fs").promises;
const path = require("path");

const projectDistDirectory = path.join(__dirname, "project-dist");
const templateFilePath = path.join(__dirname, "template.html");
const componentsPath = path.join(__dirname, "components");
const styleDirectiry = path.join(__dirname, "styles");
const assetsDirectory = path.join(__dirname, "assets");
const outputHtmlPath = path.join(projectDistDirectory, "index.html");
const outputCssPath = path.join(projectDistDirectory, "style.css");

async function generationHtml() {
    const templateContent = await fs.readFile(templateFilePath, "utf-8");
    const regex = /{{(\w+)}}/g;
    const components = {};
    const files = await fs.readdir(componentsPath);
    
    for (let file of files) {
        if(path.extname(file) === ".html" && file !== "template.html") {
            const componentName = path.basename(file, ".html");
            const content = await fs.readFile(path.join(componentsPath, file), "utf-8");
            components[componentName] = content;
        }
    }
    const outputContent = templateContent.replace(regex, (_, componentName) => {
        return components[componentName] || "";
    })
    await fs.writeFile(outputHtmlPath, outputContent);
}

async function compliteStyles() {
    const files = await fs.readdir(styleDirectiry);
    const cssFileContent = [];

    for (let file of files) {
        const filePath = path.join(styleDirectiry, file);
        const fileStat = await fs.stat(filePath);

        if (fileStat.isFile() && path.extname(file) === ".css") {
            const content = await fs.readFile(filePath, "utf-8");
            cssFileContent.push(content);
        }
    }

    await fs.writeFile(outputCssPath, cssFileContent.join("\n"));
}

async function copyAssets() {
    const copyDirectory = async (src, dest) => {
        await fs.mkdir(dest, {recursive: true});

        const entries = await fs.readdir(src, {withFileTypes: true});

        for (let entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    await copyDirectory(assetsDirectory, path.join(projectDistDirectory, "assets"));
}

async function build() {
    try {
        await fs.rm(projectDistDirectory, {recursive: true, force: true});
        await fs.mkdir(projectDistDirectory, {recursive: true});

        await generationHtml();
        await compliteStyles();
        await copyAssets();
    } catch (error) {
        console.error(error);
    }
}
build();