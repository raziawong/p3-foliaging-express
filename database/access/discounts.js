const { Discount } = require("../models");

const getAllDiscounts = async () => {
  return await Discount.fetchAll();
};
const getDiscountById = async (id) => {
  return await Discount.where({ id }).fetch({
    require: true,
  });
};
const addDiscount = async (data) => {
  const discount = new Discount().set(data);
  await discount.save();
  return discount;
};
const updateDiscount = async (id, data) => {
  const discount = await getDiscountById(id);
  discount.set(data);
  await discount.save();
  return discount;
};

module.exports = {
  getAllDiscounts,
  getDiscountById,
  addDiscount,
  updateDiscount,
};
