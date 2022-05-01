const crypto = require("crypto");

const titles = {
  product: "Product Item",
  discount: "Discount Item",
  plant: "Plant Specification",
  planter: "Planter Specification",
  supply: "Supply Specification",
  user: "User",
};
const variables = {
  success: "success_messages",
  error: "error_messages",
};
const messages = {
  accessError: "Please login to access this page",
  authError: "Please try again, login or password provided is invalid",
  loginError: "Please try again, something went wrong when trying to login",
  registerSuccess: (username) => `Account ${username} registered successfully`,
  registerFail: "Please try again, account failed to register",
  usernameExists: "Username already exists",
  emailExists: "Email already exists",
  createSuccess: (title, name) => `New ${title}, ${name}, has been created`,
  createError: (title) =>
    `${title} create operation encountered an error, please try again.`,
  updateSuccess: (title, name) => `${title}, ${name}, has been updated`,
  updateError: (title) =>
    `${title} update operation encountered an error, please try again.`,
  deleteSuccess: (title, name) => `${title}, ${name}, has been deleted`,
  deleteError: (title) =>
    `${title} delete operation encountered an error, please try again.`,
  fetchError: (name, id) => `Cannot get ${name} ${id ? "with id " + id : ""}`,
  imageRequired: "Please upload at least one image",
  passwordStrength:
    "Password must be at least 8 characters long and contain at least 1 symbol, 1 uppercase, 1 lowercase and 1 number",
  decimal2Places: "Up to 2 decimal places only",
  csrfExpired: "Please try again, the form has expired",
};
const regexp = {
  password: new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  floatTwo: new RegExp(/^\d*(\.\d{1,2})?$/),
};

const getHashPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const fetchErrorHandler = (next, name, id) => {
  const err = new Error(messages.fetchError(name), id || "");
  err.status = 404;
  next(err);
};

module.exports = {
  titles,
  variables,
  messages,
  regexp,
  getHashPassword,
  fetchErrorHandler,
};
