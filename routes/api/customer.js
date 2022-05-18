const { getAllAddressTypesOpts } = require("../../database/access/addresses");
const CustomerServices = require("../../database/services/customer-services");
const { apiMessages, getHashPassword } = require("../../helpers/const");
const {
  updatePasswordForm,
  createAddressForm,
} = require("../../helpers/form-validate-api");

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
          let errors = {};
          for (let key in form.fields) {
            if (form.fields[key].error) {
              errors[key] = form.fields[key].error;
            }
          }
          res.status(402);
          res.send({ validation: { ...errors } });
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
      const addressForm = createAddressForm();
      addressForm.handle(req, {
        success: async (form) => {
          resp = await new CustomerServices(customer.id).addAddress(req.body);
        },
        error: async (form) => {
          let errors = {};
          for (let key in form.fields) {
            if (form.fields[key].error) {
              errors[key] = form.fields[key].error;
            }
          }
          res.status(402);
          res.send({ validation: { ...errors } });
        },
      });
    } else {
      res.status(406);
      res.send({ error: apiMessages.notAcceptable });
    }

    res.send({ user: resp });
  });

  router.put("/address/update", async (req, res) => {
    const customer = req.user || null;
    let resp = {};

    if (customer && customer.id) {
      const addressForm = createAddressForm();
      addressForm.handle(req, {
        success: async (form) => {
          const { id, ...inputs } = req.body;
          resp = await new CustomerServices(customer.id).updateAddress(
            id,
            inputs
          );
        },
        error: async (form) => {
          let errors = {};
          for (let key in form.fields) {
            if (form.fields[key].error) {
              errors[key] = form.fields[key].error;
            }
          }
          res.status(402);
          res.send({ validation: { ...errors } });
        },
      });
    } else {
      res.status(406);
      res.send({ error: apiMessages.notAcceptable });
    }

    res.send({ user: resp });
  });

  router.get("/address/types", async (req, res) => {
    const results = await getAllAddressTypesOpts();
    res.send({ types: results });
  });
})();

module.exports = router;
