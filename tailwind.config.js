const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./views/**/*.hbs", "./public/**/*.js", "./helpers/*.js"],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({
      strategy: "base",
    }),
  ],
  theme: {
    fontFamily: {
      serif: ["Lato", ...defaultTheme.fontFamily.serif],
    },
  },
};
