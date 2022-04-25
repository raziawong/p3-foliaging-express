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

const getAllLightRequirements = async () => {
  return await LightRequirement.fetchAll();
};

const getAllWaterFrequencies = async () => {
  return await WaterFrequency.fetchAll();
};

const getAllCareLevels = async () => {
  return await CareLevel.fetchAll();
};

const getAllAttributes = async () => {
  return await Attribute.fetchAll();
};

module.exports = {
  getPlantById,
  getAllPlants,
  getAllSpecies,
  getAllLightRequirements,
  getAllWaterFrequencies,
  getAllCareLevels,
  getAllAttributes,
};
