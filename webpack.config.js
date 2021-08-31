const mode = process.env.NODE_ENV || "development";
const isDevlopment = mode === "development";
const loginEntry = isDevlopment ? ["./resources/js/login.js", "./resources/js/form.js"] : "./resources/js/login.js";

module.exports = {
    mode,
    entry: {
        app: "./resources/js/app.js",
        login: loginEntry,
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/assets/js/",
    },
    cache: false,
};
