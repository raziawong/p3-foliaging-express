const { Planter, PlanterType, PlanterMaterial } = require("../models");

const getPlanterById = async (id) => {
  return await Planter.where({ id }).fetch({
    require: false,
    withRelated: ["type", "material"],
  });
};

const getAllPlanters = async () => {
  return await Planter.fetchAll({
    withRelated: ["type", "material"],
  });
};

const getAllPlanterTypes = async () => {
  return await PlanterType.fetchAll();
};
const getAllPlanterTypesOpts = async () => {
  return await getAllPlanterTypes().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("type")])
  );
};

const getAllPlanterMaterials = async () => {
  return await PlanterMaterial.fetchAll();
};
const getAllPlanterMaterialsOpts = async () => {
  return await getAllPlanterMaterials().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("material")])
  );
};

module.exports = {
  getPlanterById,
  getAllPlanters,
  getAllPlanterTypes,
  getAllPlanterTypesOpts,
  getAllPlanterMaterials,
  getAllPlanterMaterialsOpts,
};
