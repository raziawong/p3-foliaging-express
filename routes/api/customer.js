const router = require("express").Router();

const userActions = {
  cart: require("./customer-cart"),
};

(async function () {
  router.use("/cart", userActions.cart);
})();

module.exports = router;
