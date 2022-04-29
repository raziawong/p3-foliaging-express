const session = require("express-session");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");
const { variables } = require("../helpers/const");
const csrfInstance = csrf();

require("dotenv").config();

const initSession = () => {
  return session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  });
};

const setUser = (req, res, next) => {
  //res.app.locals.user = req.session.user;
  res.locals.user = req.session.user;
  next();
};

const setCSRF = (req, res, next) => {
  csrfInstance(req, res, next);
};

const setCSRFToken = (req, res, next) => {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
};

const setFlashMessages = (req, res, next) => {
  res.locals[variables.success] = req.flash(variables.success);
  res.locals[variables.error] = req.flash(variables.error);
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("error_messages", "You need to sign in to access this page");
    res.redirect("/users/login");
  }
};

const handleCSRFError = (err, req, res, next) => {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash(variables.error, "The form has expired. Please try again");
    res.redirect("back");
  } else {
    next();
  }
};

const handleErrors = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500);
    res.render("errors/404");
  } else {
    next();
  }
};

module.exports = {
  initSession,
  setUser,
  setCSRF,
  setCSRFToken,
  setFlashMessages,
  checkIfAuthenticated,
  handleCSRFError,
  handleErrors,
};
