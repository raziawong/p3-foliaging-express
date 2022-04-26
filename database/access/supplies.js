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
  getAllSupplyTypes,
  getAllSupplyTypesOpts,
};
