const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const Color = require("color");

module.exports = {
  content: ["./views/**/*.hbs", "./public/**/*.js"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  dasiyui: {
    themes: ["garden", "forest"],
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
};
