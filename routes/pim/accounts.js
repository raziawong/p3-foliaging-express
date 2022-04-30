const router = require("express").Router();
const { addUser, searchUser } = require("../../database/access/users");
const { variables, messages, getHashPassword } = require("../../helpers/const");
const {
  createSystemLoginForm,
  createSystemRegistrationForm,
  uiFields,
} = require("../../helpers/form-accounts");

router.get("/login", (req, res) => {
  const loginForm = createSystemLoginForm();
  res.render("accounts/login", {
    form: loginForm.toHTML(uiFields),
  });
});

router.post("/login", async (req, res) => {
  const loginForm = createSystemLoginForm();
  loginForm.handle(req, {
    success: async (form) => {
      const { login, password } = form.data;
      const user = await searchUser({
        where: { username: login },
        orWhere: { email: login },
      });

      if (!user) {
        req.flash(variables.error, messages.authError);
        res.redirect("/accounts/login");
      } else {
        if (user.get("password") === getHashPassword(password)) {
          req.session.user = {
            id: user.get("id"),
            username: user.get("username"),
            email: user.get("email"),
            type: user.related("type").get("type"),
          };
          res.redirect("/user/profile");
        } else {
          req.flash(variables.error, messages.authError);
          res.redirect("/accounts/login");
        }
      }
    },
    error: (form) => {
      req.flash(variables.error, messages.authError);
      res.render("accounts/login", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/user/login");
});

router.get("/register", (req, res) => {
  const registerForm = createSystemRegistrationForm();
  res.render("accounts/register", {
    form: registerForm.toHTML(uiFields),
  });
});

router.post("/register", async (req, res) => {
  const registerForm = createSystemRegistrationForm();
  registerForm.handle(req, {
    success: async (form) => {
      let { confirm_password, password, ...inputs } = form.data;
      password = getHashPassword(password);
      const user = await addUser({ ...inputs, password });
      req.flash(variables.success, messages.registerSuccess(user.username));
      res.redirect("/accounts/login");
    },
    error: (form) => {
      res.render("accounts/register", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

module.exports = router;
