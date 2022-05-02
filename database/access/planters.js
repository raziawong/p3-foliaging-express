const { Planter, PlanterType, PlanterMaterial } = require("../models");

const getAllPlanters = async () => {
  try {
    return await Planter.fetchAll({
      withRelated: ["type", "material"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getPlanterById = async (id) => {
  try {
    return await Planter.where({ id }).fetch({
      require: false,
      withRelated: ["type", "material"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addPlanter = async (data) => {
  try {
    const planter = new Planter().set(data);
    await planter.save();
    return planter;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updatePlanter = async (planter, data) => {
  try {
    if (planter) {
      planter.set(data);
      await planter.save();
    }
    return planter;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllPlanterTypes = async () => {
  try {
    return await PlanterType.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllPlanterTypesOpts = async () => {
  return await getAllPlanterTypes().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("type")])
  );
};

const getAllPlanterMaterials = async () => {
  try {
    return await PlanterMaterial.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
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
