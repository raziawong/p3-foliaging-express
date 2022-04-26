const { Supply, SupplyType } = require("../models");

const getSupplyById = async (id) => {
  return await Supply.where({ id }).fetch({
    require: false,
    withRelated: ["type"],
  });
};
const getAllSupplies = async () => {
  return await Supply.fetchAll({
    withRelated: ["type"],
  });
};
const addSupply = async (data) => {
  const supply = new Supply().set(data);
  await supply.save();
  return supply;
};
const updateSupply = async (id, data) => {
  const supply = await getSupplyById(id);
  supply.set(data);
  await supply.save();
  return supply;
};

const getAllSupplyTypes = async () => {
  return await SupplyType.fetchAll();
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
