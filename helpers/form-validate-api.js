const forms = require("forms");
const { searchCustomer } = require("../database/access/customers");
const { messages, regexp } = require("./const");
const { fields, validators } = forms;

const createRegistrationForm = () => {
  return forms.create(
    {
      username: fields.string({
        required: true,
        validators: [
          async function (form, field, callback) {
            if (field.data) {
              const user = await searchCustomer({ username: field.data });
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
              const user = await searchCustomer({ email: field.data });
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
        validators: [
          validators.regexp(regexp.password, messages.passwordStrength),
        ],
      }),
      confirm_password: fields.password({
        required: true,
        validators: [validators.matchField("password")],
      }),
    },
    { validatePastFirstError: true }
  );
};

const createLoginForm = () => {
  return forms.create(
    {
      login: fields.string({
        label: "Username/ Email",
        required: true,
      }),
      password: fields.password({
        required: true,
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
        validators: [
          validators.regexp(regexp.password, messages.passwordStrength),
        ],
      }),
      confirm_password: fields.password({
        required: true,
        validators: [validators.matchField("password")],
      }),
    },
    { validatePastFirstError: true }
  );
};

const createAddressForm = () => {
  return forms.create(
    {
      label: fields.string({
        required: true,
        validators: [validators.maxlength(20)],
      }),
      line_1: fields.string({
        required: true,
        validators: [validators.maxlength(100)],
      }),
      line_2: fields.string({
        required: false,
        validators: [validators.maxlength(100)],
      }),
      floor_number: fields.string({
        required: false,
        validators: [
          validators.maxlength(2),
          validators.digits(),
          function (form, field, callback) {
            if (form.unit_number && !field.data) {
              callback(messages.floorRequired);
            } else {
              callback();
            }
          },
        ],
      }),
      unit_number: fields.string({
        required: false,
        validators: [
          validators.digits(),
          function (form, field, callback) {
            if (form.floor_number && !field.data) {
              callback(messages.unitRequired);
            } else {
              callback();
            }
          },
        ],
      }),
      postal_code: fields.string({
        required: true,
        validators: [validators.maxlength(6), validators.digits()],
      }),
    },
    { validatePastFirstError: true }
  );
};

module.exports = {
  createRegistrationForm,
  createLoginForm,
  updatePasswordForm,
  createAddressForm,
};
