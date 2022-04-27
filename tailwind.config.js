const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./views/**/*.hbs", "./public/**/*.js", "./helpers/*.js"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    fontFamily: {
      serif: ["Lato", ...defaultTheme.fontFamily.serif],
    },
  },
};
