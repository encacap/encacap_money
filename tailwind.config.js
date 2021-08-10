const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    purge: {
        enabled: process.env.NODE_ENV === "production" ? true : false,
        content: ["./*.html", "./**/*.html"],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    variants: {},
    plugins: [],
};
