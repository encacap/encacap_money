module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        app: "./resources/js/app.js",
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/assets/js/",
    },
};
