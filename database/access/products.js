const { Product, Color, Size, Image, Discount } = require("../models");

const getProductById = (id) => {
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
}

const getAllProducts = () => {
  return await Product.fetchAll();
}

const getAllColors = () => {
  return await Color.fetchAll();
}

const getAllSizes = () => {
  return await Size.fetchAll();
}

const getAllImages = () => {
  return await Image.fetchAll();
}

const getAllDiscounts = () => {
  return await Discount.fetchAll();
}

module.exports = {
  getProductById,
  getAllProducts,
  getAllColors,
  getAllSizes,
  getAllImages,
  getAllDiscounts,
};
