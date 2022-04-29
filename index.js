const express = require("express");
const hbs = require("hbs");
const waxOn = require("wax-on");
const cors = require("cors");
const flash = require("express-flash");
require("dotenv").config();
const {
  initSession,
  setUser,
  setCSRF,
  setCSRFToken,
  setFlashMessages,
  handleErrors,
} = require("./middleware");

const app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath("./views/layouts");
hbs.registerPartials(__dirname + "/views/partials");

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cors());
app.use(initSession());
app.use(setUser);
app.use(setCSRF);
app.use(setCSRFToken);
app.use(flash());
app.use(setFlashMessages);
app.use(handleErrors);

const ims = {
  specifications: require("./routes/pim/specifications"),
  products: require("./routes/pim/products"),
  users: require("./routes/pim/users"),
};

(async function () {
  app.get("/", function (req, res) {
    res.redirect("/landing");
  });

  app.use("/products", ims.products);
  app.use("/specifications", ims.specifications);
  app.use("/users", ims.users);

  app.use((req, res, next) => {
    res.status(404);
    res.render("errors/404");
  });
})();

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
