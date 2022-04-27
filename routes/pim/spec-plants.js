const router = require("express").Router();
const {
  getAllPlants,
  getAllSpeciesOpts,
  getAllCareLevelsOpts,
  getAllLightRequirementsOpts,
  getAllWaterFrequenciesOpts,
  getAllTraitsOpts,
  getPlantById,
  addPlant,
  updatePlant,
} = require("../../database/access/plants");
const { messages, titles, variables } = require("../../helpers/const");
const { createPlantForm, uiFields } = require("../../helpers/form");

router.get("/", async (req, res) => {
  const items = await getAllPlants();
  res.render("listing/plants", {
    plants: items.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const plantForm = createPlantForm(
    await getAllSpeciesOpts(),
    await getAllCareLevelsOpts(),
    await getAllLightRequirementsOpts(),
    await getAllWaterFrequenciesOpts(),
    await getAllTraitsOpts()
  );
  res.render("operations/create", {
    form: plantForm.toHTML(uiFields),
  });
});

router.post("/create", async (req, res) => {
  const plantForm = createPlantForm(
    await getAllSpeciesOpts(),
    await getAllCareLevelsOpts(),
    await getAllLightRequirementsOpts(),
    await getAllWaterFrequenciesOpts(),
    await getAllTraitsOpts()
  );

  plantForm.handle(req, {
    success: async (form) => {
      const plant = await addPlant(form.data);
      req.flash(
        variables.success,
        messages.createSuccess(titles.plant, plant.get("name"))
      );
      res.redirect("/specifications/plants");
    },
    error: async (form) => {
      res.render("operations/create", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/update", async (req, res) => {
  const plant = await getPlantById(req.params.id);
  let plantForm = createPlantForm(
    await getAllSpeciesOpts(),
    await getAllCareLevelsOpts(),
    await getAllLightRequirementsOpts(),
    await getAllWaterFrequenciesOpts(),
    await getAllTraitsOpts()
  );
  const { traits, ...dbData } = plant.attributes;
  const selected = await plant.related("traits").pluck("id");
  plantForm = plantForm.bind({
    ...dbData,
    traits: selected,
  });
  res.render("operations/update", {
    form: plantForm.toHTML(uiFields),
  });
});

router.post("/:id/update", async (req, res) => {
  const plantForm = createPlantForm(
    await getAllSpeciesOpts(),
    await getAllCareLevelsOpts(),
    await getAllLightRequirementsOpts(),
    await getAllWaterFrequenciesOpts(),
    await getAllTraitsOpts()
  );
  plantForm.handle(req, {
    success: async (form) => {
      const plant = await updatePlant(req.params.id, form.data);
      req.flash(
        variables.success,
        messages.updateSuccess(titles.plant, plant.get("name"))
      );
      res.redirect("/specifications/plants");
    },
    error: async (form) => {
      res.render("operations/update", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/delete", async (req, res) => {
  const item = await getPlantById(req.params.id);
  res.render("operations/delete", {
    item: item.toJSON(),
    homePath: "/specifications/plants",
  });
});

router.post("/:id/delete", async (req, res) => {
  const item = await getPlantById(req.params.id);
  const name = item.get("name");

  try {
    if (item) {
      await item.destroy();
    }
  } catch (err) {
    req.flash(variables.error, messages.deleteError(titles.plant));
    res.redirect(`/specifications/plants/${req.params.id}/delete`);
  } finally {
    req.flash(variables.success, messages.deleteSuccess(titles.plant, name));
    res.redirect("/specifications/plants");
  }
});

module.exports = router;
