const forms = require("forms");
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
    `<div class="${wrapClass}"><div class="form-control m-2">` +
    label +
    widget +
    error +
    "</div></div>"
  );
};

const createProductForm = (
  plants,
  planters,
  supplies,
  discounts,
  colors,
  sizes
) => {
  return forms.create(
    {
      uploadcare_group_id: fields.string({
        required: validators.required("Please upload at least one image"),
        widget: widgets.hidden(),
      }),
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
      discounts: fields.string({
        widget: widgets.multipleSelect(),
        choices: discounts,
      }),
      color_id: fields.string({
        label: "Color",
        widget: widgets.select(),
        choices: colors,
      }),
      size_id: fields.string({
        label: "Size",
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
        errorAfterField: true,
        validators: [validators.min(1)],
        widget: widgets.number(),
      }),
    },
    { validatePastFirstError: true }
  );
};

const updateProductForm = (discounts, colors, sizes) => {
  return forms.create(
    {
      uploadcare_group_id: fields.string({
        required: validators.required("Please upload at least one image"),
        widget: widgets.hidden(),
      }),
      title: fields.string({
        required: true,
        errorAfterField: true,
        validators: [validators.maxlength(150)],
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
      discounts: fields.string({
        widget: widgets.multipleSelect(),
        choices: discounts,
      }),
      color_id: fields.string({
        label: "Color",
        widget: widgets.select(),
        choices: colors,
      }),
      size_id: fields.string({
        label: "Size",
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
        errorAfterField: true,
        validators: [validators.min(1)],
        widget: widgets.number(),
      }),
    },
    { validatePastFirstError: true }
  );
};

const createDiscountForm = () => {
  return forms.create(
    {
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
        widget: widgets.checkbox(),
      }),
    },
    { validatePastFirstError: true }
  );
};

const createPlantForm = (
  species,
  care_levels,
  light_reqs,
  water_freqs,
  traits
) => {
  return forms.create(
    {
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
      traits: fields.string({
        errorAfterField: true,
        widget: widgets.multipleSelect(),
        choices: traits,
      }),
    },
    { validatePastFirstError: true }
  );
};

const createPlanterForm = (type, material) => {
  return forms.create(
    {
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
    },
    { validatePastFirstError: true }
  );
};

const createSupplyForm = (type) => {
  return forms.create(
    {
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
    },
    { validatePastFirstError: true }
  );
};

const createSystemRegistrationForm = () => {
  return forms.create(
    {
      username: fields.string({
        required: true,
        errorAfterField: true,
      }),
      email: fields.string({
        required: true,
        errorAfterField: true,
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

module.exports = {
  uiFields,
  createProductForm,
  updateProductForm,
  createDiscountForm,
  createPlantForm,
  createPlanterForm,
  createSupplyForm,
  createSystemRegistrationForm,
};
