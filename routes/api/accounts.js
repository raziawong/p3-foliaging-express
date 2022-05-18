const router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  apiMessages,
  getHashPassword,
  generateAccessToken,
} = require("../../helpers/const");
const {
  searchCustomer,
  addCustomer,
} = require("../../database/access/customers");
const {
  createLoginForm,
  createRegistrationForm,
} = require("../../helpers/form-validate-api");
const {
  getBlacklistedToken,
  addBlacklistedToken,
} = require("../../database/access/blacklisted-token");
const { getAllAddressTypesOpts } = require("../../database/access/addresses");

router.post("/register", async (req, res) => {
  const registerForm = createRegistrationForm();

  registerForm.handle(req, {
    success: async (form) => {
      let { confirm_password, password, ...inputs } = form.data;
      password = getHashPassword(password);
      const customer = await addCustomer({ ...inputs, password });
      res.send({
        message: apiMessages.registeredSuccess,
        user: customer.get("username"),
      });
    },
    empty: () => {
      res.sendstatus(406);
      res.send({ validation: "empty details is not acceptable" });
    },
    error: (form) => {
      let errors = {};
      for (let key in form.fields) {
        if (form.fields[key].error) {
          errors[key] = form.fields[key].error;
        }
      }
      res.status(406);
      res.send({ validation: { ...errors } });
    },
  });
});

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
        res.send({ error: apiMessages.authError });
      } else {
        if (customer.get("password") === getHashPassword(password)) {
          const { username, email, id } = customer.attributes;
          const accessToken = generateAccessToken(
            { username, email, id },
            process.env.TOKEN_SECRET,
            process.env.TOKEN_EXPIRY
          );
          const refreshToken = generateAccessToken(
            { username, email, id },
            process.env.REFRESH_TOKEN_SECRET,
            process.env.REFRESH_TOKEN_EXPIRY
          );
          res.send({
            message: apiMessages.loginSuccess,
            tokens: { accessToken, refreshToken },
          });
        } else {
          res.status(401);
          res.send({ error: apiMessages.authError });
        }
      }
    },
    empty: () => {
      res.status(401);
      res.send({ error: apiMessages.authError });
    },
    error: (form) => {
      let errors = {};
      for (let key in form.fields) {
        if (form.fields[key].error) {
          errors[key] = form.fields[key].error;
        }
      }
      res.status(406);
      res.send({ validation: { ...errors } });
    },
  });
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    res.sendStatus(401);
  } else {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          await addBlacklistedToken({ token: refreshToken });
          res.send({ message: apiMessages.logoutSuccess });
        }
      }
    );
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken) {
    const dirtyToken = await getBlacklistedToken(refreshToken);

    if (dirtyToken) {
      res.status(401);
      res.send({ error: apiMessages.jwtRefreshExpired });
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return res.sendStatus(403);
          }

          const { username, email, id } = payload;
          const accessToken = generateAccessToken(
            { username, email, id },
            process.env.TOKEN_SECRET,
            process.env.TOKEN_EXPIRY
          );
          res.send({ accessToken });
        }
      );
    }
  } else {
    res.sendStatus(401);
  }
});

router.get("/address/types", async (req, res) => {
  const results = await getAllAddressTypesOpts();
  res.send({ types: results });
});

module.exports = router;
