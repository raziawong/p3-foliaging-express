const router = require("express").Router();
const {
  variables,
  messages,
  getHashPassword,
  generateAccessToken,
} = require("../../helpers/const");
const { searchCustomer } = require("../../database/access/customers");
const { createLoginForm } = require("../../helpers/form-validate-api");
const {
  checkIfAuthenticated,
  checkIfAuthenticatedJWT,
} = require("../../middleware");

router.post("/login", (req, res) => {
  const loginForm = createLoginForm();
  loginForm.handle(req, {
    success: async (form) => {
      const { login, password } = form.data;
      const customer = await searchCustomer({
        where: { username: login },
        orWhere: { email: login },
      });

      if (!customer) {
        res.status(401);
        res.send({ error: messages.authError });
      } else {
        if (customer.get("password") === getHashPassword(password)) {
          const accessToken = generateAccessToken(customer);
          res.send({ accessToken });
        } else {
          res.status(401);
          res.send({ error: messages.authError });
        }
      }
    },
    empty: () => {
      res.status(401);
      res.send({ error: messages.authError });
    },
    error: (form) => {
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
});

router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
  const customer = req.user;
  res.send(user);
});

module.exports = router;
