const { Product, Color, Size } = require("../models");
const { getAllDiscounts } = require("./discounts");
const { getAllPlanters } = require("./planters");
const { getAllPlants } = require("./plants");
const { getAllSupplies } = require("./supplies");

const getAllProducts = async () => {
  return await Product.fetchAll({
    withRelated: ["color", "size", "discounts", "plant", "planter", "supply"],
  });
};
const getProductById = async (id) => {
  try {
    return await Product.where({ id }).fetch({
      require: true,
      withRelated: ["color", "size", "discounts", "plant", "planter", "supply"],
    });
  } catch (err) {}

  return false;
};
const addProduct = async (data) => {
  const { discounts, ...inputs } = data;
  const product = new Product().set(inputs);
  await product.save();
  if (discounts) {
    await product.discounts().attach(discounts.split(","));
  }
  return product;
};
const updateProduct = async (product, data) => {
  const { discounts, ...inputs } = data;
  product.set(inputs);
  await product.save();
  if (discounts) {
    const selected = discounts.split(",");
    const existing = await product.related("discounts").pluck("id");
    const remove = existing.filter((id) => selected.includes(id) === false);
    await product.discounts().detach(remove);
    await product.discounts().attach(selected);
  }
  return product;
};

const getAllColors = async () => {
  return await Color.fetchAll();
};
const getAllColorsOpts = async () => {
  const opts = await getAllColors().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("color")])
  );
  opts.unshift(["", "None"]);
  return opts;
};

const getAllSizes = async () => {
  return await Size.fetchAll();
};
const getAllSizesOpts = async () => {
  const opts = await getAllSizes().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("size")])
  );
  opts.unshift(["", "None"]);
  return opts;
};

const getAllDiscountsOpts = async () => {
  const opts = await getAllDiscounts().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("title")])
  );
  return opts;
};
const getAllPlantsOpts = async () => {
  const opts = await getAllPlants().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("name")])
  );
  opts.unshift(["", "None"]);
  return opts;
};
const getAllPlantersOpts = async () => {
  const opts = await getAllPlanters().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("name")])
  );
  opts.unshift(["", "None"]);
  return opts;
};
const getAllSuppliesOpts = async () => {
  const opts = await getAllSupplies().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("name")])
  );
  opts.unshift(["", "None"]);
  return opts;
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  getAllColors,
  getAllColorsOpts,
  getAllSizes,
  getAllSizesOpts,
  getAllDiscountsOpts,
  getAllPlantsOpts,
  getAllPlantersOpts,
  getAllSuppliesOpts,
};
