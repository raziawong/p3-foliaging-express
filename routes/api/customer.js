const CustomerServices = require("../../database/services/customer-services");
const { apiMessages, getHashPassword } = require("../../helpers/const");
const { updatePasswordForm } = require("../../helpers/form-validate-api");

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
    let resp = {};

    if (customer && customer.id) {
      resp = await new CustomerServices(customer.id).getCustomer();
    } else {
      res.status(406);
      res.send({ error: apiMessages.notAcceptable });
    }

    res.send({ user: resp });
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

  router.post("/password/update", async (req, res) => {
    const customer = req.user || null;
    let resp = {};

    if (customer && customer.id) {
      const passwordForm = updatePasswordForm();
      passwordForm.handle(req, {
        success: async (form) => {
          const { confirm_password, password } = req.body;
          resp = await new CustomerServices(customer.id).updateAccount({
            password: getHashPassword(password),
          });
        },
        error: async (form) => {
          res.render("user/profile", {
            user: user,
            form: form.toHTML(uiFields),
          });
        },
      });
    } else {
      res.status(406);
      res.send({ error: apiMessages.notAcceptable });
    }

    res.send({ user: resp });
  });

  router.get("/addresses", async (req, res) => {
    const customer = req.user || null;
    let resp = {};

    if (customer && customer.id) {
      resp = await new CustomerServices(customer.id).getAddresses();
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
