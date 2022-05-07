const forms = require("forms");
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
    "rounded-sm focus:border-gray-200 bg-zinc-400 text-zinc-50 text-sm",
    "dark:bg-slate-500 dark:focus:border-gray-50",
  ];
  if (oWidget.type !== "checkbox") {
    oWidget.classes.push("w-full p-2");
  } else if (oWidget.type === "textarea") {
    oWidget.classes.push("h-24");
  } else if (oWidget.type === "checkbox") {
    oWidget.classes.push("mx-2");
  }

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

const createSearchForm = (specifications, discounts, colors, sizes) => {
  return forms.create(
    {
      title: fields.string(),
      specification: fields.string({
        label: "Specification",
        widget: widgets.select(),
        choices: specifications,
      }),
      min_price: fields.number({
        label: "Min. Price",
        errorAfterField: true,
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
      }),
      max_price: fields.number({
        label: "Max. Price",
        errorAfterField: true,
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
      }),
      min_stock: fields.number({
        label: "Min. Stock",
        errorAfterField: true,
        validators: [validators.min(1), validators.integer()],
      }),
      max_stock: fields.number({
        label: "Max. Stock",
        errorAfterField: true,
        validators: [validators.min(1), validators.integer()],
      }),
      color_id: fields.string({
        label: "Colors",
        widget: widgets.select(),
        choices: colors,
      }),
      size_id: fields.string({
        label: "Sizes",
        widget: widgets.select(),
        choices: sizes,
      }),
      discounts: fields.string({
        widget: widgets.multipleSelect(),
        choices: discounts,
      }),
    },
    { validatePastFirstError: true }
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
        required: validators.required(messages.imageRequired),
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
        validators: [validators.min(1), validators.integer()],
        widget: widgets.text(),
      }),
      price: fields.number({
        label: "Price ($)",
        required: true,
        errorAfterField: true,
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
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
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
      }),
      width: fields.number({
        label: "Width / Circumference (cm)",
        errorAfterField: true,
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
      }),
      weight: fields.number({
        label: "Weight (kg)",
        errorAfterField: true,
        validators: [
          validators.min(0.1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
      }),
    },
    { validatePastFirstError: true }
  );
};

const updateProductForm = (discounts, colors, sizes) => {
  return forms.create(
    {
      uploadcare_group_id: fields.string({
        required: validators.required(messages.required),
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
        validators: [validators.min(1), validators.integer()],
        widget: widgets.text(),
      }),
      price: fields.number({
        label: "Price ($)",
        required: true,
        errorAfterField: true,
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
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
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
      }),
      width: fields.number({
        label: "Width / Circumference (cm)",
        errorAfterField: true,
        validators: [
          validators.min(1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
      }),
      weight: fields.number({
        label: "Weight (kg)",
        errorAfterField: true,
        validators: [
          validators.min(0.1),
          validators.regexp(regexp.floatTwo, messages.decimal2Places),
        ],
        widget: widgets.text(),
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
        widget: widgets.text(),
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

const createPlanterForm = (types, materials) => {
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
        choices: types,
      }),
      material_id: fields.string({
        required: true,
        errorAfterField: true,
        widget: widgets.select(),
        choices: materials,
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

const createSupplyForm = (types) => {
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
        choices: types,
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

const updateOrderForm = (statuses) => {
  return forms.create(
    {
      status_id: fields.string({
        required: true,
        errorAfterField: true,
        widget: widgets.select(),
        choices: statuses,
      }),
      delivery_tracking: fields.string({
        errorAfterField: true,
        validators: [validators.maxlength(100)],
        widget: widgets.textarea(),
      }),
      remarks: fields.string({
        widget: widgets.textarea(),
      }),
    },
    { validatePastFirstError: true }
  );
};

module.exports = {
  uiFields,
  createSearchForm,
  createProductForm,
  updateProductForm,
  createDiscountForm,
  createPlantForm,
  createPlanterForm,
  createSupplyForm,
  updateOrderForm,
};
