const express = require("express");
const hbs = require("hbs");
const waxOn = require("wax-on");
require("dotenv").config();

let app = express();
app.set("view engine", "hbs");

// static folder
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
    res.send("Alive!");
  });
}

main();

app.listen(3000, () => {
  console.log("Server has started");
});
