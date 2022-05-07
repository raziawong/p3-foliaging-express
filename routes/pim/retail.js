const router = require("express").Router();

const retail = {
  orders: require("./retail-orders"),
  products: require("./retail-products"),
  discounts: require("./retail-discounts"),
};

(async function () {
  router.use("/orders", retail.orders);
  router.use("/products", retail.products);
  router.use("/discounts", retail.discounts);
})();

module.exports = router;
