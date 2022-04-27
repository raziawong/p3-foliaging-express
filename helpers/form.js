const forms = require("forms");
const { fields, validators, widgets } = forms;

var uiFields = (name, object) => {
  const oWidget = object.widget;
  if (!Array.isArray(oWidget.classes)) {
    oWidget.classes =
      oWidget.classes && oWidget.length
        ? oWidget.classes.split(",")
        : oWidget.type === "select"
        ? ["select", "select-sm", "select-bordered", "w-full"]
        : oWidget.type === "multipleSelect"
        ? ["select", "select-bordered", "w-full", "h-32"]
        : oWidget.type === "textarea"
        ? ["textarea", "textarea-bordered", "w-full", "h-24"]
        : ["input", "input-sm", "input-bordered", "w-full"];
  }

  const errorClass = object.error
    ? oWidget.type === "select" || oWidget.type === "multipleSelect"
      ? "select-error"
      : oWidget.type === "textarea"
      ? "textarea-error"
      : "input-error"
    : "";
  if (errorClass) {
    oWidget.classes.push(errorClass);
  }

  object.cssClasses = { label: ["label"] };
  const label = object.labelHTML(name);
  const error = object.error
    ? `<label class="label"><span class="text-red-500 label-text-alt">` +
      object.error +
      "</span></label>"
    : "";

  const widget = oWidget.toHTML(name, object);
  return (
    `<div class="form-control w-full py-1">` + label + widget + error + "</div>"
  );
};

const createProductForm = (plants, planters, supplies, colors, sizes) => {
  return forms.create({
    title: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.maxlength(150)],
    }),
    plant_id: fields.string({
      label: "Plant",
      errorAfterField: true,
      widget: widgets.select(),
      choices: plants,
    }),
    planter_id: fields.string({
      label: "Planter",
      errorAfterField: true,
      widget: widgets.select(),
      choices: planters,
    }),
    supply_id: fields.string({
      label: "Supply",
      errorAfterField: true,
      widget: widgets.select(),
      choices: supplies,
    }),
    stock: fields.number({
      required: true,
      errorAfterField: true,
      validators: [validators.min(1)],
      widget: widgets.number(),
    }),
    price: fields.number({
      label: "Price ($)",
      required: true,
      errorAfterField: true,
      validators: [validators.min(1)],
      widget: widgets.number(),
    }),
    color_id: fields.string({
      label: "Color",
      errorAfterField: true,
      widget: widgets.select(),
      choices: colors,
    }),
    size_id: fields.string({
      label: "Size",
      errorAfterField: true,
      widget: widgets.select(),
      choices: sizes,
    }),
    height: fields.number({
      label: "Height (cm)",
      errorAfterField: true,
      validators: [validators.min(1)],
      widget: widgets.number(),
    }),
    width: fields.number({
      label: "Width / Circumference (cm)",
      errorAfterField: true,
      validators: [validators.min(1)],
      widget: widgets.number(),
    }),
    weight: fields.number({
      label: "Weight (kg)",
      validators: [validators.min(1)],
      widget: widgets.number(),
    }),
  });
};

const createDiscountForm = () => {
  return forms.create({
    title: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.maxlength(50)],
    }),
    code: fields.string({
      errorAfterField: true,
      validators: [validators.maxlength(10)],
    }),
    percentage: fields.number({
      required: true,
      errorAfterField: true,
      validators: [validators.min(1), validators.max(99)],
      widget: widgets.number(),
    }),
    start_date: fields.date({
      required: true,
      errorAfterField: true,
      widget: widgets.date(),
    }),
    end_date: fields.date({
      required: true,
      errorAfterField: true,
      widget: widgets.date(),
    }),
    all_products: fields.boolean({
      widget: widgets.checkbox({ classes: ["toggle toggle-secondary"] }),
    }),
  });
};

const createPlantForm = (
  species,
  care_levels,
  light_reqs,
  water_freqs,
  traits
) => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.maxlength(150)],
    }),
    alias: fields.string({
      errorAfterField: true,
      validators: [validators.maxlength(150)],
    }),
    species_id: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: species,
    }),
    description: fields.string({
      errorAfterField: true,
      validators: [validators.maxlength(200)],
      widget: widgets.textarea(),
    }),
    details: fields.string({
      widget: widgets.textarea(),
    }),
    plant_guide: fields.string({
      widget: widgets.textarea(),
    }),
    care_level_id: fields.string({
      label: "Care Level",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: care_levels,
    }),
    light_requirement_id: fields.string({
      label: "Light Requirement",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: light_reqs,
    }),
    water_frequency_id: fields.string({
      label: "Water Frequency",
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: water_freqs,
    }),
    traits: fields.string({
      errorAfterField: true,
      widget: widgets.multipleSelect(),
      choices: traits,
    }),
  });
};

const createPlanterForm = (type, material) => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.maxlength(150)],
    }),
    type_id: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: type,
    }),
    material_id: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: material,
    }),
    description: fields.string({
      errorAfterField: true,
      validators: [validators.maxlength(200)],
      widget: widgets.textarea(),
    }),
    details: fields.string(),
  });
};

const createSupplyForm = (type) => {
  return forms.create({
    name: fields.string({
      required: true,
      errorAfterField: true,
      validators: [validators.maxlength(150)],
    }),
    type_id: fields.string({
      required: true,
      errorAfterField: true,
      widget: widgets.select(),
      choices: type,
    }),
    description: fields.string({
      errorAfterField: true,
      validators: [validators.maxlength(200)],
      widget: widgets.textarea(),
    }),
    details: fields.string({
      widget: widgets.textarea(),
    }),
  });
};

module.exports = {
  uiFields,
  createProductForm,
  createDiscountForm,
  createPlantForm,
  createPlanterForm,
  createSupplyForm,
};
