const { Discount } = require("../models");

const getAllDiscounts = async () => {
  try {
    return await Discount.fetchAll();
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

const getDiscountById = async (id) => {
  try {
    return await Discount.where({ id }).fetch({
      require: true,
    });
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

const addDiscount = async (data) => {
  try {
    const discount = new Discount().set(data);
    await discount.save();
    return discount;
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

const updateDiscount = async (discount, data) => {
  try {
    if (discount) {
      discount.set(data);
      await discount.save();
    }
    return discount;
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

module.exports = {
  getAllDiscounts,
  getDiscountById,
  addDiscount,
  updateDiscount,
};
