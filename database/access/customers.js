const { Customer } = require("../models");

const searchCustomer = async (query) => {
  try {
    return await Customer.query(query).fetch({
      require: false,
      withRelated: ["addresses", "cartItems", "orders"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getCustomerById = async (cid) => {
  try {
    return await Customer.where({
      id: cid,
    }).fetch({
      require: false,
      withRelated: ["addresses", "addresses.type", "orders"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addCustomer = async (data) => {
  try {
    const customer = new Customer().set(data);
    await customer.save();
    return customer;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateCustomer = async (customer, data) => {
  try {
    customer.set(data);
    await customer.save();
    return customer;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  searchCustomer,
  getCustomerById,
  addCustomer,
  updateCustomer,
};
