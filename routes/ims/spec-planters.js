const router = require("express").Router();
const {
  getAllPlanters,
  getAllPlanterTypesOpts,
  getAllPlanterMaterialsOpts,
  getPlanterById,
  addPlanter,
  updatePlanter,
} = require("../../database/access/planters");
const { messages, titles, variables } = require("../../helpers/const");
const { uiFields, createPlanterForm } = require("../../helpers/form");

router.get("/", async (req, res) => {
  const items = await getAllPlanters();
  res.render("specifications/planters/index", {
    planters: items.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const planterForm = createPlanterForm(
    await getAllPlanterTypesOpts(),
    await getAllPlanterMaterialsOpts()
  );
  res.render("operations/create", {
    form: planterForm.toHTML(uiFields),
  });
});

router.post("/create", async (req, res) => {
  const planterForm = createPlanterForm(
    await getAllPlanterTypesOpts(),
    await getAllPlanterMaterialsOpts()
  );

  planterForm.handle(req, {
    success: async (form) => {
      const planter = await addPlanter(form.data);
      req.flash(
        variables.success,
        messages.createSuccess(titles.planter, planter.get("name"))
      );
      res.redirect("/specifications/planters");
    },
    error: async (form) => {
      req.flash(variables.error, messages.createError(titles.planter));
      res.redirect("/specifications/planters/create");
    },
  });
});

router.get("/:id/update", async (req, res) => {
  const planter = await getPlanterById(req.params.id);
  let planterForm = createPlanterForm(
    await getAllPlanterTypesOpts(),
    await getAllPlanterMaterialsOpts()
  );
  planterForm = planterForm.bind({ ...planter.attributes });
  res.render("operations/update", {
    form: planterForm.toHTML(uiFields),
  });
});

router.post("/:id/update", async (req, res) => {
  const planterForm = createPlanterForm(
    await getAllPlanterTypesOpts(),
    await getAllPlanterMaterialsOpts()
  );
  planterForm.handle(req, {
    success: async (form) => {
      const planter = await updatePlanter(req.params.id, form.data);
      req.flash(
        variables.success,
        messages.updateSuccess(titles.planter, planter.get("name"))
      );
      res.redirect("/specifications/planters");
    },
    error: async (form) => {
      req.flash(variables.error, messages.updateError(titles.planter));
      res.redirect(`/specifications/planters/${req.params.id}/update`);
    },
  });
});

router.get("/:id/delete", async (req, res) => {
  const item = await getPlanterById(req.params.id);
  res.render("operations/delete", {
    item: item.toJSON(),
    homePath: "/specifications/planters",
  });
});

router.post("/:id/delete", async (req, res) => {
  const item = await getPlanterById(req.params.id);
  const name = item.get("name");

  try {
    await item.destroy();
  } catch (err) {
    req.flash(
      variables.error,
      req.flash(variables.error, messages.deleteError(titles.planter))
    );
    res.redirect(`/specifications/planters/${req.params.id}/delete`);
  } finally {
    req.flash(variables.success, messages.deleteSuccess(titles.planter, name));
    res.redirect("/specifications/planters");
  }
});

module.exports = router;
