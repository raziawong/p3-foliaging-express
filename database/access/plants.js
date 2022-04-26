const {
  Plant,
  Species,
  LightRequirement,
  WaterFrequency,
  CareLevel,
  Attribute,
} = require("../models");

const getPlantById = async (id) => {
  return await Plant.where({ id }).fetch({
    require: false,
    withRelated: ["species", "light", "water", "care", "attributes"],
  });
};

const getAllPlants = async () => {
  return await Plant.fetchAll({
    withRelated: ["species", "light", "water", "care"],
  });
};

const getAllSpecies = async () => {
  return await Species.fetchAll();
};
const getAllSpeciesOpts = async () => {
  return await getAllSpecies().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("name")])
  );
};

const getAllLightRequirements = async () => {
  return await LightRequirement.fetchAll();
};
const getAllLightRequirementsOpts = async () => {
  return await getAllLightRequirements().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("requirement")])
  );
};

const getAllWaterFrequencies = async () => {
  return await WaterFrequency.fetchAll();
};
const getAllWaterFrequenciesOpts = async () => {
  return await getAllWaterFrequencies().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("frequency")])
  );
};

const getAllCareLevels = async () => {
  return await CareLevel.fetchAll();
};
const getAllCareLevelsOpts = async () => {
  return await getAllCareLevels().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("level")])
  );
};

const getAllAttributes = async () => {
  return await Attribute.fetchAll();
};
const getAllAttributesOpts = async () => {
  return await getAllAttributes().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("attribute")])
  );
};

module.exports = {
  getPlantById,
  getAllPlants,
  getAllSpecies,
  getAllSpeciesOpts,
  getAllLightRequirements,
  getAllLightRequirementsOpts,
  getAllWaterFrequencies,
  getAllWaterFrequenciesOpts,
  getAllCareLevels,
  getAllCareLevelsOpts,
  getAllAttributes,
  getAllAttributesOpts,
};
