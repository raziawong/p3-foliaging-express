const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var uiFields = function (name, object) {
  if (!Array.isArray(object.widget.classes)) {
    object.widget.classes = [];
  }

  if (object.widget.classes.indexOf("form-control") === -1) {
    object.widget.classes.push("form-control");
  }

  var validationclass = object.value && !object.error ? "is-valid" : "";
  validationclass = object.error ? "is-invalid" : validationclass;
  if (validationclass) {
    object.widget.classes.push(validationclass);
  }

  var label = object.labelHTML(name);
  var error = object.error
    ? '<div class="invalid-feedback">' + object.error + "</div>"
    : "";

  var widget = object.widget.toHTML(name, object);
  return '<div class="form-group">' + label + widget + error + "</div>";
};

const createPlantForm = (species, care, light, water) => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.max(150)],
    }),
    alias: fields.string({
      errorAfterField: true,
      validators: [validators.max(150)],
    }),
    species: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: species,
    }),
    description: fields.string({
      validators: [validators.max(200)],
    }),
    details: fields.string(),
    plant_guide: fields.string(),
    care_level: fields.string({
      label: "Care Level",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: care,
    }),
    light_requirement: fields.string({
      label: "Light Requirement",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: light,
    }),
    water_frequency: fields.string({
      label: "Water Frequency",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: water,
    }),
  });
};

const createPlanterForm = (type, material) => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.max(150)],
    }),
    type: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: type,
    }),
    material: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: material,
    }),
    description: fields.string({
      validators: [validators.max(200)],
    }),
    details: fields.string(),
  });
};

const createSupplyForm = (type) => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.max(150)],
    }),
    type: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: type,
    }),
    description: fields.string({
      validators: [validators.max(200)],
    }),
    details: fields.string(),
  });
};

module.exports = {
  uiFields,
  createPlantForm,
  createPlanterForm,
  createSupplyForm,
};
