const { getUserById, updateUser } = require("../../database/access/users");
const { messages, variables, titles } = require("../../helpers/const");
const { updatePasswordForm, uiFields } = require("../../helpers/form-accounts");

const router = require("express").Router();

router.get("/profile", (req, res) => {
  const user = req.session.user;
  //   if (!user) {
  //     req.flash(variables.error, messages.accessError);
  //     res.redirect("/accounts/login");
  //   } else {
  //     res.render("users/profile", {
  //       user: user,
  //     });
  //   }

  res.render("users/profile", {
    user: user,
    form: updatePasswordForm().toHTML(uiFields),
  });
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
        res.redirect("/users/profile");
      },
      error: async (form) => {
        res.render("users/profile", {
          user: user,
          form: passwordForm.toHTML(uiFields),
        });
      },
    });
  }
});

module.exports = router;
