const router = require("express").Router();
const {
  createSystemRegistrationForm,
  uiFields,
} = require("../../helpers/form");

router.get("/register", (req, res) => {
  const registerForm = createSystemRegistrationForm();
  res.render("users/register", {
    form: registerForm.toHTML(uiFields),
  });
});

module.exports = router;
