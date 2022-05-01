const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./views/**/*.hbs",
    "./public/**/*.js",
    "./helpers/*.js",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({
      strategy: "base",
      strategy: "class",
    }),
    require("tw-elements/dist/plugin"),
  ],
  theme: {
    fontFamily: {
      serif: ["Lato", ...defaultTheme.fontFamily.serif],
    },
    extend: {
      backgroundImage: {
        "plant-pattern": "url('/assets/img/background.png')",
      },
    },
  },
};
