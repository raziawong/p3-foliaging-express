const { Supply, SupplyType } = require("../models");

const getSupplyById = async (id) => {
  return await Supply.where({ id }).fetch({
    require: false,
    withRelated: ["type"],
  });
};

const getAllSupplies = async () => {
  return await Supply.fetchAll();
};

const getAllSupplyTypes = async () => {
  return await SupplyType.fetchAll();
};

module.exports = {
  getAllSupplies,
  getAllSupplyTypes,
};
