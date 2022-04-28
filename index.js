const express = require("express");
const hbs = require("hbs");
const waxOn = require("wax-on");
const cors = require("cors");
require("dotenv").config();

const session = require("express-session");
const flash = require("express-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");
const { variables } = require("./helpers/const");

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

app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

const csrfInstance = csrf();
app.use(function (req, res, next) {
  csrfInstance(req, res, next);
});
app.use(function (req, res, next) {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

app.use(flash());
app.use(function (req, res, next) {
  res.locals[variables.success] = req.flash(variables.success);
  res.locals[variables.error] = req.flash(variables.error);
  next();
});

app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash(variables.error, "The form has expired. Please try again");
    res.redirect("back");
  } else {
    next();
  }
});

const ims = {
  specifications: require("./routes/pim/specifications"),
  products: require("./routes/pim/products"),
};

(async function () {
  app.get("/", function (req, res) {
    res.redirect("/landing");
  });

  app.use("/products", ims.products);
  app.use("/specifications", ims.specifications);
})();

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
