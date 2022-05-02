const router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  variables,
  messages,
  getHashPassword,
  generateAccessToken,
} = require("../../helpers/const");
const { searchCustomer } = require("../../database/access/customers");
const { createLoginForm } = require("../../helpers/form-validate-api");
const { checkIfAuthenticatedJWT } = require("../../middleware");
const { BlacklistedToken } = require("../../database/models");
const {
  addBlacklistToken,
} = require("../../database/access/blacklisted-token");

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
        res.sendStatus(401);
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
          res.send({ accessToken, refreshToken });
        } else {
          res.sendStatus(401);
        }
      }
    },
    empty: () => {
      res.sendStatus(401);
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
        }

        await addBlacklistToken({ token: refreshToken });
        res.send({ message: "logged out" });
      }
    );
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          return res.sendStatus(403);
        }

        const accessToken = generateAccessToken(
          payload,
          process.env.TOKEN_SECRET,
          process.env.TOKEN_EXPIRY
        );
        res.send({ accessToken });
      }
    );
  } else {
    res.sendStatus(401);
  }
});

router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
  const customer = req.user;
  res.send(customer);
});

module.exports = router;
