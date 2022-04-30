const { messages, variables } = require("../../helpers/const");

const router = require("express").Router();

router.get("/profile", (req, res) => {
  const user = req.session.user;
  if (!user) {
    req.flash(variables.error, messages.accessError);
    res.redirect("/accounts/login");
  } else {
    res.render("users/profile", {
      user: user,
    });
  }
});

module.exports = router;
