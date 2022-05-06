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
  checkIfAuthenticated,
  checkIfAuthenticatedJWT,
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
app.use(flash());
app.use(setFlashMessages);
app.use(setUser);
app.use(setCSRF);
app.use(setCSRFToken);
app.use(handleErrors);

const pim = {
  specifications: require("./routes/pim/specifications"),
  products: require("./routes/pim/products"),
  accounts: require("./routes/pim/accounts"),
  user: require("./routes/pim/user"),
};

const api = {
  products: require("./routes/api/products"),
  accounts: require("./routes/api/accounts"),
  customerActions: require("./routes/api/customer"),
};

(async function () {
  app.get("/", function (req, res) {
    if (req.session.user) {
      res.redirect("/products");
    } else {
      res.redirect("/accounts/login");
    }
  });

  app.use("/products", checkIfAuthenticated, pim.products);
  app.use("/specifications", checkIfAuthenticated, pim.specifications);
  app.use("/accounts", pim.accounts);
  app.use("/user", checkIfAuthenticated, pim.user);
  app.use("/api/products", express.json(), api.products);
  app.use("/api/accounts", express.json(), api.accounts);
  app.use(
    "/api/user",
    [checkIfAuthenticatedJWT, express.json()],
    api.customerActions
  );

  app.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
      res.status(404);
      res.render("errors/404");
    } else {
      next();
    }
  });
})();

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
