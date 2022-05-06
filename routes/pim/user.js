const router = require("express").Router();
const { getUserById, updateUser } = require("../../database/access/users");
const { messages, variables, titles } = require("../../helpers/const");
const { updatePasswordForm, uiFields } = require("../../helpers/form-accounts");

router.get("/profile", (req, res) => {
  const userSession = req.session.user;
  if (!userSession) {
    req.flash(variables.error, messages.accessError);
    req.session.save(() => {
      res.redirect("/accounts/login");
    });
  } else {
    res.render("user/profile", {
      user: userSession,
      form: updatePasswordForm().toHTML(uiFields),
    });
  }
});

router.post("/profile", async (req, res) => {
  const userSession = req.session.user;
  const user = userSession ? await getUserById(userSession.id) : false;

  if (user) {
    const passwordForm = updatePasswordForm();
    passwordForm.handle(req, {
      success: async (form) => {
        const updatedUser = await updateUser(user, form.data);
        req.flash(
          variables.success,
          messages.updateSuccess(titles.user, updatedUser.name)
        );
        req.session.save(() => {
          res.redirect("/user/profile");
        });
      },
      error: async (form) => {
        res.render("user/profile", {
          user: user,
          form: form.toHTML(uiFields),
        });
      },
    });
  }
});

module.exports = router;
