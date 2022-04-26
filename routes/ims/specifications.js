const router = require("express").Router();
const {
  getAllPlanters,
  getAllPlanterTypesOpts,
  getAllPlanterMaterialsOpts,
} = require("../../database/access/planters");
const {
  getAllPlants,
  getAllSpeciesOpts,
  getAllCareLevelsOpts,
  getAllLightRequirementsOpts,
  getAllWaterFrequenciesOpts,
} = require("../../database/access/plants");
const {
  getAllSupplies,
  getAllSupplyTypesOpts,
} = require("../../database/access/supplies");
const {
  createPlantForm,
  uiFields,
  createPlanterForm,
  createSupplyForm,
} = require("../../forms");

router.get("/", async (req, res) => {
  res.redirect("/products");
});

router.get("/plants", async (req, res) => {
  const items = await getAllPlants();
  res.render("specifications/plants/index", {
    plants: items.toJSON(),
  });
});

router.get("/plants/create", async (req, res) => {
  const form = createPlantForm(
    await getAllSpeciesOpts(),
    await getAllCareLevelsOpts(),
    await getAllLightRequirementsOpts(),
    await getAllWaterFrequenciesOpts()
  );
  res.render("specifications/create", {
    form: form.toHTML(uiFields),
  });
});

router.get("/planters", async (req, res) => {
  const items = await getAllPlanters();
  res.render("specifications/planters/index", {
    planters: items.toJSON(),
  });
});

router.get("/planters/create", async (req, res) => {
  const form = createPlanterForm(
    await getAllPlanterTypesOpts(),
    await getAllPlanterMaterialsOpts()
  );
  res.render("specifications/create", {
    form: form.toHTML(uiFields),
  });
});

router.get("/supplies", async (req, res) => {
  const items = await getAllSupplies();
  res.render("specifications/supplies/index", {
    supplies: items.toJSON(),
  });
});

router.get("/supplies/create", async (req, res) => {
  const form = createSupplyForm(await getAllSupplyTypesOpts());
  res.render("specifications/create", {
    form: form.toHTML(uiFields),
  });
});

module.exports = router;
