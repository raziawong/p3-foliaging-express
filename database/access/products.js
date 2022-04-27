const { Product, Color, Size, Image, Discount } = require("../models");
const { getAllPlanters } = require("./planters");
const { getAllPlants } = require("./plants");
const { getAllSupplies } = require("./supplies");

const getProductById = async (id) => {
  return await Product.where({ id }).fetch({
    require: true,
    withRelated: [
      "color",
      "size",
      "images",
      "discounts",
      "plant",
      "planter",
      "supply",
    ],
  });
};
const getAllProducts = async () => {
  return await Product.fetchAll({
    withRelated: [
      "color",
      "size",
      "images",
      "discounts",
      "plant",
      "planter",
      "supply",
    ],
  });
};
const addProduct = async (data) => {
  const { images, discounts, ...inputs } = data;
  const product = new Product().set(inputs);
  await product.save();
  if (discounts) {
    await product.discounts().attach(discounts.split(","));
  }
  return product;
};
const updateProduct = async (id, data) => {
  const product = await getProductById(id);
  const { images, discounts, ...inputs } = data;
  product.set(inputs);
  await product.save();

  const selected = discounts.split(",");
  const existing = await product.related("discounts").pluck("id");
  const remove = existing.filter((id) => selected.includes(id) === false);
  await product.discounts().detach(remove);
  await product.discounts().attach(selected);

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

const getAllImages = async () => {
  return await Image.fetchAll();
};
const getAllImagesOpts = async () => {
  return await getAllImages().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("image_url")])
  );
};

const getAllDiscounts = async () => {
  return await Discount.fetchAll();
};
const getAllDiscountsOpts = async () => {
  const opts = await getAllDiscounts().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("title")])
  );
  opts.unshift(["", "None"]);
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
  getProductById,
  getAllProducts,
  addProduct,
  updateProduct,
  getAllColors,
  getAllColorsOpts,
  getAllSizes,
  getAllSizesOpts,
  getAllImages,
  getAllImagesOpts,
  getAllDiscounts,
  getAllDiscountsOpts,
  getAllPlantsOpts,
  getAllPlantersOpts,
  getAllSuppliesOpts,
};
