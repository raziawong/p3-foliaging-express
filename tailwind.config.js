module.exports = {
  mode: "jit",
  content: ["./views/**/*.hbs", "./public/**/*.js"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
