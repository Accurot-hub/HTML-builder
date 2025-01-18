const fs = require("fs");
const path = require("path");

const secretFolder = path.join(__dirname, "secret-folder");

fs.readdir(secretFolder, (err, files) => {
    if (err) {
        console.log("Error reading files")
    }

    files.forEach(file => {
        const filePath = path.join(secretFolder, file);
        
        fs.stat(filePath, (err, stats) => {
            if (stats.isFile()) {
                const fileName = path.basename(file, path.extname(file));
                const fileExtension = path.extname(file).slice(1);
                const fileSize = stats.size;
                console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
            }
        })
    })
})