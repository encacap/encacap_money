const mode = process.env.NODE_ENV || "development";
const isDevlopment = mode === "development";

module.exports = {
    mode,
    entry: {
        app: "./resources/js/app.js",
        login: ["./resources/js/login.js", isDevlopment ? "./resources/js/validator.js" : null],
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/assets/js/",
    },
    cache: false,
};
