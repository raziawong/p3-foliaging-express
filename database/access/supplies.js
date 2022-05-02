const { Supply, SupplyType } = require("../models");

const getAllSupplies = async () => {
  try {
    return await Supply.fetchAll({
      withRelated: ["type"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getSupplyById = async (id) => {
  try {
    return await Supply.where({ id }).fetch({
      require: false,
      withRelated: ["type"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addSupply = async (data) => {
  try {
    const supply = new Supply().set(data);
    await supply.save();
    return supply;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateSupply = async (supply, data) => {
  try {
    supply.set(data);
    await supply.save();
    return supply;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllSupplyTypes = async () => {
  try {
    return await SupplyType.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllSupplyTypesOpts = async () => {
  return await getAllSupplyTypes().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("type")])
  );
};

module.exports = {
  getSupplyById,
  getAllSupplies,
  addSupply,
  updateSupply,
  getAllSupplyTypes,
  getAllSupplyTypesOpts,
};
