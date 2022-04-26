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
const { messages, titles } = require("../../helpers/const");
const { createPlantForm, uiFields } = require("../../helpers/form");

router.get("/", async (req, res) => {
  const items = await getAllPlants();
  res.render("specifications/plants/index", {
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
  res.render("specifications/create", {
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
        "success_messages",
        messages.createSuccess(titles.plant, plant.get("name"))
      );
      res.redirect("/specifications/plants");
    },
    error: async (form) => {
      req.flash("error_messages", messages.createError(titles.plant));
      res.redirect("/specifications/plants/create");
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
  res.render("specifications/update", {
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
        "success_messages",
        messages.updateSuccess(titles.plant, plant.get("name"))
      );
      res.redirect("/specifications/plants");
    },
    error: async (form) => {
      req.flash("error_messages", messages.updateError(titles.plant));
      res.redirect(`/specifications/plants/${req.params.id}/update`);
    },
  });
});

router.get("/:id/delete", async (req, res) => {
  const item = await getPlantById(req.params.id);
  res.render("specifications/delete", {
    item: item.toJSON(),
    homePath: "/specifications/plants",
  });
});

router.post("/:id/delete", async (req, res) => {
  const item = await getPlantById(req.params.id);
  const name = item.get("name");

  try {
    await item.destroy();
  } catch (err) {
    req.flash("error_messages", messages.deleteError(titles.plant));
    res.redirect(`/specifications/plants/${req.params.id}/delete`);
  } finally {
    req.flash("success_messages", messages.deleteSuccess(titles.plant, name));
    res.redirect("/specifications/plants");
  }
});

module.exports = router;
