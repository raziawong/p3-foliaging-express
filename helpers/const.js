const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ProductServices = require("../database/services/product-services");
const { searchProducts } = require("../database/access/products");

const titles = {
  product: "Product Item",
  discount: "Discount Item",
  plant: "Plant Specification",
  planter: "Planter Specification",
  supply: "Supply Specification",
  user: "User",
  order: "Order",
};

const variables = {
  success: "success_messages",
  error: "error_messages",
  currency: "SGD",
};

const messages = {
  accessError: "Please login to access this page",
  authError: "Please try again, login or password provided is invalid",
  loginError: "Please try again, something went wrong when trying to login",
  registerSuccess: (username) => `Account ${username} registered successfully`,
  registerFail: "Please try again, account failed to register",
  usernameExists: "Username already exists",
  emailExists: "Email already exists",
  floorRequired: "Floor is required when Unit is filled",
  unitRequired: "Unit is required when Floor is filled",
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
  shippingAddressInvalid: (cid, aid) =>
    `Customer with id of ${cid} does not have the shipping address id of ${aid}`,
  customerInvalid: (cid) => `Customer with id of ${cid} does not exist`,
  cartEmpty: (cid) => `Customer with id of ${cid} does not have cart items`,
};

const apiMessages = {
  registeredSuccess: "registered success",
  loginSuccess: "login success",
  logoutSuccess: "logout success",
  authError: "login details provided is invalid",
  jwtRefreshExpired: "refresh token has expired",
  notAcceptable: "missing data to continue",
  paymentSuccess: "payment has been accepted",
  paymentCancelled: "payment has been cancelled",
};

const regexp = {
  password: new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  floatTwo: new RegExp(/^\d*(\.\d{1,2})?$/),
};

const likeKey = process.env.LIKE_SYNTAX;

const searchAndProcessProducts = async (builder) => {
  let products = await searchProducts(builder);

  if (products) {
    products = products.toJSON();
    products = products.filter((item) => item.stock > 0);

    for (const item of products) {
      const productService = new ProductServices(item.id, item.discounts);

      if (item.uploadcare_group_id) {
        item.images = await productService.getImagesUrls();
      }

      item.deals = productService.getDeals();
    }
  }

  return products;
};

const getHashPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("base64");

const generateSignature = (secret, expire) =>
  crypto.createHmac("sha256", secret).update(expire).digest("hex");

const generateAccessToken = (user, secret, expiresIn) => {
  return jwt.sign({ ...user }, secret, { expiresIn });
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
  apiMessages,
  regexp,
  likeKey,
  searchAndProcessProducts,
  getHashPassword,
  generateSignature,
  generateAccessToken,
  fetchErrorHandler,
};
