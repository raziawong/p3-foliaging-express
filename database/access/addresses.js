const { Address } = require("../models");

const getAddressById = async (aid) => {
  try {
    return await Address.where({
      id: aid,
    }).fetch({
      require: false,
      withRelated: ["type", "customer", "orders"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAddressByCustomerId = async (cid) => {
  try {
    return await Address.where({
      customer_id: cid,
    }).fetchAll({
      require: false,
      withRelated: ["type", "customer", "orders"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addAddressForCustomer = async (cid, data) => {
  try {
    const address = new Address({ customer_id: cid, ...data });
    await address.save();
    return address;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateAddress = async (data) => {
  try {
    const { id, ...inputs } = data;
    const address = await getAddressById(id);
    if (address) {
      address.set(inputs);
      await address.save();
    }
    return address;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const deleteAddress = async (aid) => {
  try {
    const address = await getAddressById(aid);
    if (address) {
      return await address.destroy();
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const archiveAddress = async (address) => {
  try {
    address.set("archived", true);
    await address.save();
    return address;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  getAddressById,
  getAddressByCustomerId,
  addAddressForCustomer,
  updateAddress,
  deleteAddress,
  archiveAddress,
};
