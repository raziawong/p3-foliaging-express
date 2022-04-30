const forms = require("forms");
const { searchUser } = require("../database/access/users");
const { messages } = require("./const");
const { fields, validators, widgets } = forms;

var uiFields = (name, object) => {
  const oWidget = object.widget;
  if (!Array.isArray(oWidget.classes)) {
    oWidget.classes =
      oWidget.classes && oWidget.length ? oWidget.classes.split(",") : [];
    oWidget.classes = [
      ...oWidget.classes,
      "rounded-sm bg-gray-200 border-transparent focus:border-gray-200 focus:bg-zinc-800 focus:text-zinc-50",
      "dark:bg-zinc-600 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:text-zinc-50",
    ];
    if (oWidget.type !== "checkbox") {
      oWidget.classes.push("w-full p-2");
    } else if (oWidget.type === "textarea") {
      oWidget.classes.push("h-24");
    } else if (oWidget.type === "checkbox") {
      oWidget.classes.push("mx-2");
    }
  }

  const errorClass = object.error ? "border-red-800 dark:border-red-300" : "";
  if (errorClass) {
    oWidget.classes.push(errorClass);
  }

  object.cssClasses = { label: ["label dark:text-zinc-100"] };
  const label = object.labelHTML(name);
  const error = object.error
    ? `<label class="text-red-800 dark:text-red-300 prose-sm">` +
      object.error +
      "</label>"
    : "";

  const wrapClass =
    oWidget.type === "hidden"
      ? "basis-full self-start"
      : "basis-full lg:basis-1/2 self-center";
  const widget = oWidget.toHTML(name, object);
  return (
    `<div class="${wrapClass}"><div class="form-control mx-2 my-4">` +
    label +
    widget +
    error +
    "</div></div>"
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
