const { Discount } = require("../models");

const getAllDiscounts = async () => {
  return await Discount.fetchAll();
};
const getDiscountById = async (id) => {
  try {
    return await Discount.where({ id }).fetch({
      require: true,
    });
  } catch (err) {}
  return false;
};
const addDiscount = async (data) => {
  try {
    const discount = new Discount().set(data);
    await discount.save();
    return discount;
  } catch (err) {}
  return false;
};
const updateDiscount = async (discount, data) => {
  try {
    if (discount) {
      discount.set(data);
      await discount.save();
    }
    return discount;
  } catch (err) {}
  return false;
};

module.exports = {
  getAllDiscounts,
  getDiscountById,
  addDiscount,
  updateDiscount,
};
