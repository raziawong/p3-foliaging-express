const {
  Plant,
  Species,
  LightRequirement,
  WaterFrequency,
  CareLevel,
  Trait,
} = require("../models");

const getAllPlants = async () => {
  try {
    return await Plant.fetchAll({
      withRelated: ["species", "light", "water", "care"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getPlantById = async (id) => {
  try {
    return await Plant.where({ id }).fetch({
      require: false,
      withRelated: ["species", "light", "water", "care", "traits"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addPlant = async (data) => {
  try {
    const { traits, ...inputs } = data;
    const plant = new Plant().set(inputs);
    await plant.save();
    if (traits) {
      await plant.traits().attach(traits.split(","));
    }
    return plant;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updatePlant = async (plant, data) => {
  try {
    if (plant) {
      const { traits, ...inputs } = data;
      plant.set(inputs);
      await plant.save();

      if (traits) {
        const selected = traits.split(",");
        const existing = await plant.related("traits").pluck("id");
        const remove = existing.filter((id) => selected.includes(id) === false);
        await plant.traits().detach(remove);
        await plant.traits().attach(selected);
      }
    }
    return plant;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllSpecies = async () => {
  try {
    return await Species.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllSpeciesOpts = async () => {
  return await getAllSpecies().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("name")])
  );
};

const getAllLightRequirements = async () => {
  try {
    return await LightRequirement.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllLightRequirementsOpts = async () => {
  return await getAllLightRequirements().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("requirement")])
  );
};

const getAllWaterFrequencies = async () => {
  try {
    return await WaterFrequency.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllWaterFrequenciesOpts = async () => {
  return await getAllWaterFrequencies().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("frequency")])
  );
};

const getAllCareLevels = async () => {
  try {
    return await CareLevel.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllCareLevelsOpts = async () => {
  return await getAllCareLevels().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("level")])
  );
};

const getAllTraits = async () => {
  try {
    return await Trait.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
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
