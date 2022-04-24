module.exports = {
  mode: "jit",
  content: ["./views/**/*.hbs", "./src/**/*.js"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
