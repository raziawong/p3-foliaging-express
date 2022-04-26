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
const addPlanter = async (data) => {
  const planter = new Planter().set(data);
  await planter.save();
  return planter;
};
const updatePlanter = async (id, data) => {
  const planter = await getPlanterById(id);
  planter.set(data);
  await planter.save();
  return planter;
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
  addPlanter,
  updatePlanter,
  getAllPlanterTypes,
  getAllPlanterTypesOpts,
  getAllPlanterMaterials,
  getAllPlanterMaterialsOpts,
};
