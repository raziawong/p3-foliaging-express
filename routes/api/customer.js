const CustomerServices = require("../../database/services/customer-services");
const { apiMessages } = require("../../helpers/const");

const router = require("express").Router();

const userActions = {
  cart: require("./customer-cart"),
  checkout: require("./customer-checkout"),
};

(async function () {
  router.use("/cart", userActions.cart);
  router.use("/checkout", userActions.checkout);

  router.get("/profile", async (req, res) => {
    const customer = req.user || {};
    res.send({ user: customer });
  });

  router.patch("/profile/update", async (req, res) => {
    const customer = req.user || null;
    let resp = {};

    if (customer && customer.id) {
      resp = await new CustomerServices(customer.id).updateAccount(req.body);
    } else {
      res.status(406);
      res.send({ error: apiMessages.notAcceptable });
    }

    res.send({ user: resp });
  });

  router.post("/address/add", async (req, res) => {
    const customer = req.user || null;
    let resp = {};

    if (customer && customer.id) {
      resp = await new CustomerServices(customer.id).addAddress(req.body);
    } else {
      res.status(406);
      res.send({ error: apiMessages.notAcceptable });
    }

    res.send({ user: resp });
  });

  router.patch("/address/update", async (req, res) => {
    const customer = req.user || null;
    let resp = {};

    if (customer && customer.id) {
      const { id, ...inputs } = req.body;
      resp = await new CustomerServices(customer.id).updateAddress(id, inputs);
    } else {
      res.status(406);
      res.send({ error: apiMessages.notAcceptable });
    }

    res.send({ user: resp });
  });
})();

module.exports = router;
