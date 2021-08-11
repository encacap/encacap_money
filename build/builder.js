const fsPromise = require("fs/promises");
const fsExtra = require("fs-extra");

(async () => {
    const BUILD_FOLDER = "./dist/";

    const copy = async (src, dest) => {
        try {
            await fsExtra.copy(src, dest);
        } catch (error) {
            throw error;
        }
    };

    await fsExtra.remove(BUILD_FOLDER);

    try {
        const files = await fsPromise.readdir("./");
        const includeFiles = ["index.html"];
        const excludeFolders = ["node_modules", "build", "resources"];
        for (const file of files) {
            const path = `./${file}`;
            const stats = await fsPromise.stat(path);

            try {
                if (stats.isDirectory() && !excludeFolders.includes(file) && file[0] !== ".") {
                    await copy(path, `${BUILD_FOLDER}${file}`);
                } else if (stats.isFile() && includeFiles.includes(file)) {
                    await copy(path, `${BUILD_FOLDER}${file}`);
                }
            } catch (error) {
                console.log("Build error: " + error);
            }
        }
        console.log("Build completed ^_^");
    } catch (error) {
        console.log(error);
    }
})();
