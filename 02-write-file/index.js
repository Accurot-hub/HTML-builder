const { stdin, stdout } = process;
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt");
const output = fs.createWriteStream(filePath, "utf-8");

stdout.write("Enter text:\n");

stdin.on("data", (data) => {
    const input = data.toString().trim();

    if (input.toLowerCase() === "exit") {
        process.exit();
    } else {
        output.write(`${input}\n`);
        stdout.write("Enter text:\n");
    }
})
process.on("SIGINT", () => process.exit());