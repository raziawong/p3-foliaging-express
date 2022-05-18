const express = require("express");
const hbs = require("hbs");
const waxOn = require("wax-on");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(initSession());
app.use(flash());
app.use(setFlashMessages);
app.use(setUser);
app.use(setCSRF);
app.use(setCSRFToken);
app.use(handleErrors);

const pim = {
  retail: require("./routes/pim/retail"),
  specifications: require("./routes/pim/specifications"),
  accounts: require("./routes/pim/accounts"),
  user: require("./routes/pim/user"),
};

const api = {
  products: require("./routes/api/products"),
  accounts: require("./routes/api/accounts"),
  customerActions: require("./routes/api/customer"),
  stripeProcesses: require("./routes/api/stripe"),
};

(async function () {
  app.get("/", function (req, res) {
    if (req.session.user) {
      res.redirect("/retail/products");
    } else {
      res.redirect("/accounts/login");
    }
  });

  app.use("/retail", checkIfAuthenticated, pim.retail);
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
  app.use("/api/payment", api.stripeProcesses);

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
