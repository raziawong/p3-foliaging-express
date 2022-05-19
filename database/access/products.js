const { Product, Color, Size } = require("../models");
const { getAllDiscounts } = require("./discounts");
const { getAllPlanters } = require("./planters");
const { getAllPlants } = require("./plants");
const { getAllSupplies } = require("./supplies");

const searchProducts = async (queryBuilder) => {
  try {
    return await Product.query(queryBuilder).fetchAll({
      require: false,
      withRelated: ["color", "size", "discounts", "plant", "planter", "supply"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllProducts = async () => {
  try {
    return await Product.fetchAll({
      withRelated: ["color", "size", "discounts", "plant", "planter", "supply"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getProductById = async (id) => {
  try {
    return await Product.where({ id }).fetch({
      require: true,
      withRelated: [
        "color",
        "size",
        "discounts",
        "plant.light",
        "plant.water",
        "plant.care",
        "plant.traits",
        "plant.species",
        "planter.material",
        "planter.type",
        "supply.type",
      ],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addProduct = async (data) => {
  try {
    const { discounts, ...inputs } = data;
    const product = new Product().set(inputs);
    await product.save();
    if (discounts) {
      await product.discounts().attach(discounts.split(","));
    }
    return product;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateProduct = async (product, data) => {
  try {
    if (product) {
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
    }
    return product;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateProductStock = async (pid, deductable) => {
  try {
    const product = await getProductById(pid);

    if (product) {
      product.set("stock", product.get("stock") - deductable);
      await product.save();
    }

    return product;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllColors = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await Color.collection().orderBy(sortCol, sortOrder).fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllColorsOpts = async () => {
  const opts = await getAllColors("color").then((resp) =>
    resp.map((o) => [o.get("id"), o.get("color")])
  );
  opts.unshift(["", "None"]);
  return opts;
};

const getAllSizes = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await Size.collection().orderBy(sortCol, sortOrder).fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllSizesOpts = async () => {
  const opts = await getAllSizes("size").then((resp) =>
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

const getAllSpecificationsOpts = async () => {
  const promises = [
    Promise.resolve(["", "None"]),
    ...(await getAllPlants().then((resp) =>
      resp.map((o) => ["plants_" + o.get("name"), "Plant: " + o.get("name")])
    )),
    ...(await getAllPlanters().then((resp) =>
      resp.map((o) => [
        "planters_" + o.get("name"),
        "Planter: " + o.get("name"),
      ])
    )),
    ...(await getAllSupplies().then((resp) =>
      resp.map((o) => ["supplies_" + o.get("name"), "Supply: " + o.get("name")])
    )),
  ];
  return Promise.all(promises).then((resp) => resp);
};

module.exports = {
  searchProducts,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  updateProductStock,
  getAllColors,
  getAllColorsOpts,
  getAllSizes,
  getAllSizesOpts,
  getAllDiscountsOpts,
  getAllPlantsOpts,
  getAllPlantersOpts,
  getAllSuppliesOpts,
  getAllSpecificationsOpts,
};
