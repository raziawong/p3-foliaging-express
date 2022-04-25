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

const ims = {
  inventories: require("./routes/ims/inventories"),
  products: require("./routes/ims/products"),
};

(async function () {
  app.get("/", function (req, res) {
    res.redirect("/landing");
  });

  app.use("/products", ims.products);
  app.use("/inventory", ims.inventories);
})();

app.listen(3000, () => {
  console.log("Server has started");
});
