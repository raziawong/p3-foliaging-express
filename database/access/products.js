const { Product, Color, Size, Image, Discount } = require("../models");

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
  return await Product.fetchAll();
};

const getAllColors = async () => {
  return await Color.fetchAll();
};

const getAllSizes = async () => {
  return await Size.fetchAll();
};

const getAllImages = async () => {
  return await Image.fetchAll();
};

const getAllDiscounts = async () => {
  return await Discount.fetchAll();
};

module.exports = {
  getProductById,
  getAllProducts,
  getAllColors,
  getAllSizes,
  getAllImages,
  getAllDiscounts,
};
