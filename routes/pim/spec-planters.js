const router = require("express").Router();
const {
  getAllPlanters,
  getAllPlanterTypesOpts,
  getAllPlanterMaterialsOpts,
  getPlanterById,
  addPlanter,
  updatePlanter,
} = require("../../database/access/planters");
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const {
  uiFields,
  createPlanterForm,
} = require("../../helpers/form-operations");

router.get("/", async (req, res, next) => {
  const items = await getAllPlanters();
  if (items) {
    res.render("listing/planters", {
      planters: items.toJSON(),
    });
  } else {
    fetchErrorHandler(next, "planters");
  }
});

router.get("/create", async (req, res) => {
  const planterForm = createPlanterForm(
    await getAllPlanterTypesOpts(),
    await getAllPlanterMaterialsOpts()
  );
  res.render("operations/create", {
    title: titles.planter,
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
      res.render("operations/create", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/update", async (req, res, next) => {
  const planter = await getPlanterById(req.params.id);
  if (planter) {
    let planterForm = createPlanterForm(
      await getAllPlanterTypesOpts(),
      await getAllPlanterMaterialsOpts()
    );
    planterForm = planterForm.bind({ ...planter.attributes });
    res.render("operations/update", {
      title: planter.toJSON().name,
      form: planterForm.toHTML(uiFields),
    });
  } else {
    fetchErrorHandler(next, "planters", req.params.id);
  }
});

router.post("/:id/update", async (req, res, next) => {
  const planter = await getPlanterById(req.params.id);

  if (planter) {
    const planterForm = createPlanterForm(
      await getAllPlanterTypesOpts(),
      await getAllPlanterMaterialsOpts()
    );
    planterForm.handle(req, {
      success: async (form) => {
        const updatedPlanter = await updatePlanter(planter, form.data);
        req.flash(
          variables.success,
          messages.updateSuccess(titles.planter, updatedPlanter.get("name"))
        );
        res.redirect("/specifications/planters");
      },
      error: async (form) => {
        res.render("operations/update", {
          form: form.toHTML(uiFields),
        });
      },
    });
  } else {
    fetchErrorHandler(next, "planters", req.params.id);
  }
});

router.get("/:id/delete", async (req, res, next) => {
  const item = await getPlanterById(req.params.id);
  if (item) {
    res.render("operations/delete", {
      title: item.toJSON().name,
      homePath: "/specifications/planters",
    });
  } else {
    fetchErrorHandler(next, "planters", req.params.id);
  }
});

router.post("/:id/delete", async (req, res) => {
  const item = await getPlanterById(req.params.id);
  const name = item.get("name");

  try {
    if (item) {
      await item.destroy();
      req.flash(
        variables.success,
        messages.deleteSuccess(titles.planter, name)
      );
      res.redirect("/specifications/planters");
    }
  } catch (err) {
    req.flash(variables.error, messages.deleteError(titles.planter));
    res.redirect(`/specifications/planters/${req.params.id}/delete`);
  }
});

module.exports = router;
