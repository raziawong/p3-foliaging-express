const router = require("express").Router();
const {
  getAllSupplies,
  getAllSupplyTypesOpts,
  getSupplyById,
  addSupply,
  updateSupply,
} = require("../../database/access/supplies");
const { messages, titles, variables } = require("../../helpers/const");
const { createSupplyForm, uiFields } = require("../../helpers/form");

router.get("/", async (req, res) => {
  const items = await getAllSupplies();
  res.render("listing/supplies", {
    supplies: items.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
  res.render("operations/create", {
    form: supplyForm.toHTML(uiFields),
  });
});

router.post("/create", async (req, res) => {
  const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());

  supplyForm.handle(req, {
    success: async (form) => {
      const supply = await addSupply(form.data);
      req.flash(
        variables.success,
        messages.createSuccess(titles.supply, supply.get("name"))
      );
      res.redirect("/specifications/supplies");
    },
    error: async (form) => {
      res.render("operations/create", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/update", async (req, res) => {
  const supply = await getSupplyById(req.params.id);
  let supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
  supplyForm = supplyForm.bind({ ...supply.attributes });
  res.render("operations/update", {
    form: supplyForm.toHTML(uiFields),
  });
});

router.post("/:id/update", async (req, res) => {
  const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
  supplyForm.handle(req, {
    success: async (form) => {
      const supply = await updateSupply(req.params.id, form.data);
      req.flash(
        variables.success,
        messages.updateSuccess(titles.supply, supply.get("name"))
      );
      res.redirect("/specifications/supplies");
    },
    error: async (form) => {
      res.render("operations/update", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/delete", async (req, res) => {
  const item = await getSupplyById(req.params.id);
  res.render("operations/delete", {
    item: item.toJSON(),
    homePath: "/specifications/supplies",
  });
});

router.post("/:id/delete", async (req, res) => {
  const item = await getSupplyById(req.params.id);
  const name = item.get("name");

  try {
    if (item) {
      await item.destroy();
    }
  } catch (err) {
    req.flash(variables.error, messages.deleteError(titles.supply));
    res.redirect(`/specifications/supplies/${req.params.id}/delete`);
  } finally {
    req.flash(variables.success, messages.deleteSuccess(titles.supply, name));
    res.redirect("/specifications/supplies");
  }
});

module.exports = router;
