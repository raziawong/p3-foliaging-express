const { Address, BacklogAddress, AddressType } = require("../models");

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

const updateAddress = async (aid, data) => {
  try {
    const address = await getAddressById(aid);
    if (address) {
      address.set(data);
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

const getAllAddressTypes = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await AddressType.collection().orderBy(sortCol, sortOrder).fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllAddressTypesOpts = async () => {
  return await getAllAddressTypes("type").then((resp) =>
    resp.map((o) => [o.get("id"), o.get("type")])
  );
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

const addBacklogAddress = async (data) => {
  try {
    const address = new BacklogAddress().set(data);
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
  getAllAddressTypes,
  getAllAddressTypesOpts,
  addBacklogAddress,
  getBacklogAddressByAddress,
};
