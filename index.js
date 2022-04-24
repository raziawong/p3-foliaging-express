const express = require("express");
const hbs = require("hbs");
const waxOn = require("wax-on");
require("dotenv").config();

const app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath("./views/layouts");

app.use(
  express.urlencoded({
    extended: false,
  })
);

async function main() {
  app.get("/", (req, res) => {
    res.render("landing/index");
  });
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
