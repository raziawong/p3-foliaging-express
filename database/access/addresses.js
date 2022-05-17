const { Address, BacklogAddress } = require("../models");

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

const addBacklogAddressByAddressId = async (aid) => {
  try {
    const address = await getAddressById(aid);

    if (address) {
      const { id, ...data } = address.toJSON();
      const backlogAddress = new BacklogAddress({ ...data });
      await backlogAddress.save();
      return backlogAddress;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getBacklogAddressByAddress = async ({
  line_1,
  line_2,
  unit_number,
  postal_code,
}) => {
  try {
    return await BacklogAddress.query(function (qb) {
      qb.where("line_1", "=", line_1)
        .andWhere("line_2", "=", line_2)
        .andWhere("unit_number", "=", unit_number)
        .andWhere("postal_code", "=", postal_code);
    }).fetchAll({
      require: false,
    });
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
  addBacklogAddressByAddressId,
  getBacklogAddressByAddress,
};
