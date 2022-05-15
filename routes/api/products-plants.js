const router = require("express").Router();
const {
  getAllSpeciesOpts,
  getAllCareLevelsOpts,
  getAllLightRequirementsOpts,
  getAllWaterFrequenciesOpts,
  getAllTraitsOpts,
} = require("../../database/access/plants");
const { searchAndProcessProducts } = require("../../helpers/const");

router.get("/", async (req, res) => {
  const queries = req.query;
  const builder = (qb) => {
    qb.whereNotNull("products.plant_id");

    if (
      queries.text ||
      queries.care ||
      queries.light ||
      queries.water ||
      queries.species ||
      queries.traits
    ) {
      qb.innerJoin("plants", "plants.id", "products.plant_id");

      if (queries.text) {
        qb.where("title", likeKey, "%" + queries.text + "%")
          .orWhere("plants.name", likeKey, "%" + queries.text + "%")
          .orWhere("plants.alias", likeKey, "%" + queries.text + "%")
          .orWhere("plants.description", likeKey, "%" + queries.text + "%");
      }

      if (queries.care) {
        qb.where("plants.care_level_id", queries.care);
      }

      if (queries.light) {
        qb.where("plants.light_requirement_id", queries.light);
      }

      if (queries.water) {
        qb.where("plants.water_frequency_id", queries.water);
      }

      if (queries.species) {
        qb.where("plants.species_id", queries.species);
      }
    }

    if (queries.traits) {
      qb.innerJoin(
        "plants_traits",
        "plants_traits.plant_id",
        "products.plant_id"
      ).where("plants_traits.trait_id", "in", queries.traits.split(","));
    }

    if (queries.min_price) {
      qb.where("price", ">=", queries.min_price * 100);
    }

    if (queries.max_price) {
      qb.where("price", "<=", queries.max_price * 100);
    }
  };

  const results = await searchAndProcessProducts(builder);
  res.send({ plants: results });
});

router.get("/species", async (req, res) => {
  const results = await getAllSpeciesOpts();
  res.send({ species: results });
});

router.get("/care-levels", async (req, res) => {
  const results = await getAllCareLevelsOpts();
  res.send({ care: results });
});

router.get("/light-requirements", async (req, res) => {
  const results = await getAllLightRequirementsOpts();
  res.send({ light: results });
});

router.get("/water-frequencies", async (req, res) => {
  const results = await getAllWaterFrequenciesOpts();
  res.send({ water: results });
});

router.get("/traits", async (req, res) => {
  const results = await getAllTraitsOpts();
  res.send({ traits: results });
});

module.exports = router;
