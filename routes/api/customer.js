const router = require("express").Router();
const { checkIfAuthenticatedJWT } = require("../../middleware");

const userActions = {
  cart: require("./customer-cart"),
};

(async function () {
  router.use("/cart", userActions.cart);

  router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
    const customer = req.user;
    res.send({ user: customer });
  });
})();

module.exports = router;
