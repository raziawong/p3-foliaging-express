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
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const { createPlantForm, uiFields } = require("../../helpers/form-operations");

router.get("/", async (req, res, next) => {
  const items = await getAllPlants();
  if (items) {
    res.render("listing/plants", {
      plants: items.toJSON(),
    });
  } else {
    fetchErrorHandler(next, "plants");
  }
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
    title: titles.plant,
    form: plantForm.toHTML(uiFields),
    homePath: "/specifications/plants",
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
      req.session.save(() => {
        res.redirect("/specifications/plants");
      });
    },
    error: async (form) => {
      res.render("operations/create", {
        form: form.toHTML(uiFields),
        homePath: "/specifications/plants",
      });
    },
  });
});

router.get("/:id/update", async (req, res, next) => {
  const plant = await getPlantById(req.params.id);

  if (plant) {
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
      title: plant.toJSON().name,
      form: plantForm.toHTML(uiFields),
      homePath: "/specifications/plants",
    });
  } else {
    fetchErrorHandler(next, "plant", req.params.id);
  }
});

router.post("/:id/update", async (req, res, next) => {
  const plant = await getPlantById(req.params.id);

  if (plant) {
    const plantForm = createPlantForm(
      await getAllSpeciesOpts(),
      await getAllCareLevelsOpts(),
      await getAllLightRequirementsOpts(),
      await getAllWaterFrequenciesOpts(),
      await getAllTraitsOpts()
    );

    plantForm.handle(req, {
      success: async (form) => {
        const updatedPlant = await updatePlant(plant, form.data);
        req.flash(
          variables.success,
          messages.updateSuccess(titles.plant, updatedPlant.get("name"))
        );
        req.session.save(() => {
          res.redirect("/specifications/plants");
        });
      },
      error: async (form) => {
        res.render("operations/update", {
          form: form.toHTML(uiFields),
          homePath: "/specifications/plants",
        });
      },
    });
  } else {
    fetchErrorHandler(next, "plant", req.params.id);
  }
});

router.get("/:id/delete", async (req, res, next) => {
  const item = await getPlantById(req.params.id);

  if (item) {
    res.render("operations/delete", {
      title: item.toJSON().name,
      homePath: "/specifications/plants",
    });
  } else {
    fetchErrorHandler(next, "plant", req.params.id);
  }
});

router.post("/:id/delete", async (req, res) => {
  const item = await getPlantById(req.params.id);

  try {
    if (item) {
      await item.destroy();

      req.flash(
        variables.success,
        messages.deleteSuccess(titles.plant, item.get("name"))
      );
      req.session.save(() => {
        res.redirect("/specifications/plants");
      });
    }
  } catch (err) {
    req.flash(variables.error, messages.deleteError(titles.plant));
    req.session.save(() => {
      res.redirect(`/specifications/plants/${req.params.id}/delete`);
    });
  }
});

module.exports = router;
