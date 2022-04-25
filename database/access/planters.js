const { Planter, PlanterType, PlanterMaterial } = require("../models");

const getPlanterById = async (id) => {
  return await Planter.where({ id }).fetch({
    require: false,
    withRelated: ["type", "material"],
  });
};

const getAllPlanters = async () => {
  return await Planter.fetchAll();
};

const getAllPlanterTypes = async () => {
  return await PlanterType.fetchAll();
};

const getAllPlanterMaterials = async () => {
  return await PlanterMaterial.fetchAll();
};

module.exports = {
  getPlanterById,
  getAllPlanters,
  getAllPlanterTypes,
  getAllPlanterMaterials,
};
