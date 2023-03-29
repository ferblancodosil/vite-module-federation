const { writeFileSync, readFileSync, readdirSync, statSync } = require("fs");
const { loadEnv } = require("vite");
const path = require("path");

const readSubdirectories = (dir, filesList) => {
    const files = readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            readSubdirectories(filePath, filesList);
        } else {
            filesList.push(filePath);
        }
    }
};

const replacement = () => {
    const mode = (process.argv.find(e => e.match("^mode=.*$")) || "mode=dev").split("=")[1]
    const selfEnv = loadEnv(mode, process.cwd());
    console.info("Replacement proccess mode", mode, selfEnv)
    const rootDir = "./dist";
    const env2use = selfEnv;
    // Buscar todos los archivos en la carpeta `dist`
    let filesList = [];
    readSubdirectories(rootDir, filesList);
    filesList = filesList.filter(file => file.split(".")[1] === "js")

    console.info("Evaluate file list", filesList)

    filesList.forEach((file) => {
        let content = readFileSync(file, "utf8");
        Object.keys(env2use).forEach((key2search) => {
            const element2search = `import.meta.env.${key2search}`
            const replace = `"${env2use[key2search]}"`;
            content = content.replace(
                new RegExp(element2search, "gi"),
                replace
            );
        });
        writeFileSync(file, content, { encoding: "utf8", flag: "w" });
    });
    console.info("End replacement proccess")
};

replacement();