const {
  Plant,
  Species,
  LightRequirement,
  WaterFrequency,
  CareLevel,
  Trait,
} = require("../models");

const getPlantById = async (id) => {
  return await Plant.where({ id }).fetch({
    require: false,
    withRelated: ["species", "light", "water", "care", "traits"],
  });
};
const getAllPlants = async () => {
  return await Plant.fetchAll({
    withRelated: ["species", "light", "water", "care"],
  });
};
const addPlant = async (data) => {
  const { traits, ...inputs } = data;
  const plant = new Plant().set(inputs);
  await plant.save();
  if (traits) {
    await plant.traits().attach(traits.split(","));
  }

  return plant;
};
const updatePlant = async (id, data) => {
  const plant = await getPlantById(id);
  const { traits, ...inputs } = data;
  plant.set(inputs);
  await plant.save();

  const selected = traits.split(",");
  const existing = await plant.related("traits").pluck("id");
  const remove = existing.filter((id) => selected.includes(id) === false);
  await plant.traits().detach(remove);
  await plant.traits().attach(selected);

  return plant;
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

const getAllTraits = async () => {
  return await Trait.fetchAll();
};
const getAllTraitsOpts = async () => {
  return await getAllTraits().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("trait")])
  );
};

module.exports = {
  getPlantById,
  getAllPlants,
  addPlant,
  updatePlant,
  getAllSpecies,
  getAllSpeciesOpts,
  getAllLightRequirements,
  getAllLightRequirementsOpts,
  getAllWaterFrequencies,
  getAllWaterFrequenciesOpts,
  getAllCareLevels,
  getAllCareLevelsOpts,
  getAllTraits,
  getAllTraitsOpts,
};
