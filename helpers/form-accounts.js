const forms = require("forms");
const { searchUser } = require("../database/access/users");
const { messages, regexp } = require("./const");
const { fields, validators, widgets } = forms;

var uiFields = (name, object) => {
  const oWidget = object.widget;
  if (!Array.isArray(oWidget.classes)) {
    oWidget.classes =
      oWidget.classes && oWidget.length ? oWidget.classes.split(",") : [];
  }

  oWidget.classes = [
    ...oWidget.classes,
    "w-full p-2 rounded-sm focus:border-gray-200 bg-zinc-400 text-zinc-50 text-sm",
    "dark:bg-slate-500 dark:focus:border-gray-50",
  ];

  const errorClass = object.error ? "border-red-800 dark:border-red-300" : "";
  if (errorClass) {
    oWidget.classes.push(errorClass);
  }

  object.cssClasses = {
    label: ["label text-sm pb-1 dark:text-zinc-100"],
  };
  const label = object.labelHTML(name);
  const error = object.error
    ? `<label class="text-red-800 dark:text-red-300 prose-sm">` +
      object.error +
      "</label>"
    : "";

  const widget = oWidget.toHTML(name, object);
  return (
    `<div class="form-control mx-2 my-4">` + label + widget + error + "</div>"
  );
};

const createSystemRegistrationForm = () => {
  return forms.create(
    {
      username: fields.string({
        required: true,
        errorAfterField: true,
        validators: [
          async function (form, field, callback) {
            if (field.data) {
              const user = await searchUser({ username: field.data });
              if (user) {
                callback(messages.usernameExists);
              } else {
                callback();
              }
            } else {
              callback();
            }
          },
          validators.maxlength(20),
        ],
      }),
      email: fields.email({
        required: true,
        errorAfterField: true,
        validators: [
          async function (form, field, callback) {
            if (field.data) {
              const user = await searchUser({ email: field.data });
              if (user) {
                callback(messages.emailExists);
              } else {
                callback();
              }
            } else {
              callback();
            }
          },
          validators.email(),
          validators.maxlength(320),
        ],
      }),
      password: fields.password({
        required: true,
        errorAfterField: true,
        validators: [
          validators.regexp(regexp.password, messages.passwordStrength),
        ],
      }),
      confirm_password: fields.password({
        required: true,
        errorAfterField: true,
        validators: [validators.matchField("password")],
      }),
    },
    { validatePastFirstError: true }
  );
};

const createSystemLoginForm = () => {
  return forms.create(
    {
      login: fields.string({
        label: "Username/ Email",
        required: true,
        errorAfterField: true,
      }),
      password: fields.password({
        required: true,
        errorAfterField: true,
      }),
    },
    { validatePastFirstError: true }
  );
};

const updatePasswordForm = () => {
  return forms.create(
    {
      password: fields.password({
        required: true,
        errorAfterField: true,
        validators: [
          validators.regexp(regexp.password, messages.passwordStrength),
        ],
      }),
      confirm_password: fields.password({
        required: true,
        errorAfterField: true,
        validators: [validators.matchField("password")],
      }),
    },
    { validatePastFirstError: true }
  );
};

module.exports = {
  uiFields,
  createSystemRegistrationForm,
  createSystemLoginForm,
  updatePasswordForm,
};
