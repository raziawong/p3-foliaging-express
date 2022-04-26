module.exports = {
  content: ["./views/**/*.hbs", "./public/**/*.js", "./forms/*.js"],
  dasiyui: {
    themes: [
      {
        garden: {
          ...require("daisyui/src/colors/themes")["[data-theme=garden]"],
          "--rounded-box": "0.2rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "uppercase",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.2rem",
        },
      },
      "forest",
    ],
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
