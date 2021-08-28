module.exports = {
    plugins: [
        require("postcss-import"),
        require("postcss-advanced-variables"),
        require("postcss-nested"),
        require("tailwindcss"),
        require("autoprefixer"),
        require("cssnano"),
    ],
};
