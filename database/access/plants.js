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

const getAllSpecies = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await Species.collection().orderBy(sortCol, sortOrder).fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllSpeciesOpts = async () => {
  return await getAllSpecies("name").then((resp) =>
    resp.map((o) => [o.get("id"), o.get("name")])
  );
};

const getAllLightRequirements = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await LightRequirement.collection()
      .orderBy(sortCol, sortOrder)
      .fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllLightRequirementsOpts = async () => {
  return await getAllLightRequirements("requirement").then((resp) =>
    resp.map((o) => [o.get("id"), o.get("requirement")])
  );
};

const getAllWaterFrequencies = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await WaterFrequency.collection()
      .orderBy(sortCol, sortOrder)
      .fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllWaterFrequenciesOpts = async () => {
  return await getAllWaterFrequencies("frequency").then((resp) =>
    resp.map((o) => [o.get("id"), o.get("frequency")])
  );
};

const getAllCareLevels = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await CareLevel.collection().orderBy(sortCol, sortOrder).fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllCareLevelsOpts = async () => {
  return await getAllCareLevels("level").then((resp) =>
    resp.map((o) => [o.get("id"), o.get("level")])
  );
};

const getAllTraits = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await Trait.collection().orderBy(sortCol, sortOrder).fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllTraitsOpts = async () => {
  return await getAllTraits("trait").then((resp) =>
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
