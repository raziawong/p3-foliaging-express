const router = require("express").Router();
const {
  getAllSupplies,
  getAllSupplyTypesOpts,
  getSupplyById,
  addSupply,
  updateSupply,
} = require("../../database/access/supplies");
const { messages, titles } = require("../../helpers/const");
const { createSupplyForm, uiFields } = require("../../helpers/form");

router.get("/", async (req, res) => {
  const items = await getAllSupplies();
  res.render("specifications/supplies/index", {
    supplies: items.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
  res.render("specifications/create", {
    form: supplyForm.toHTML(uiFields),
  });
});

router.post("/create", async (req, res) => {
  const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());

  supplyForm.handle(req, {
    success: async (form) => {
      const supply = await addSupply(form.data);
      req.flash(
        "success_messages",
        messages.createSuccess(titles.supply, supply.get("name"))
      );
      res.redirect("/specifications/supplies");
    },
    error: async (form) => {
      req.flash("error_messages", messages.createError(titles.supply));
      res.redirect("/specifications/supplies/create");
    },
  });
});

router.get("/:id/update", async (req, res) => {
  const supply = await getSupplyById(req.params.id);
  let supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
  supplyForm = supplyForm.bind({ ...supply.attributes });
  res.render("specifications/update", {
    form: supplyForm.toHTML(uiFields),
  });
});

router.post("/:id/update", async (req, res) => {
  const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
  supplyForm.handle(req, {
    success: async (form) => {
      const supply = await updateSupply(req.params.id, form.data);
      req.flash(
        "success_messages",
        messages.updateSuccess(titles.supply, supply.get("name"))
      );
      res.redirect("/specifications/supplies");
    },
    error: async (form) => {
      req.flash("error_messages", messages.updateError(titles.supply));
      res.redirect(`/specifications/supplies/${req.params.id}/update`);
    },
  });
});

router.get("/:id/delete", async (req, res) => {
  const item = await getSupplyById(req.params.id);
  res.render("specifications/delete", {
    item: item.toJSON(),
    homePath: "/specifications/supplies",
  });
});

router.post("/:id/delete", async (req, res) => {
  const item = await getSupplyById(req.params.id);
  const name = item.get("name");

  try {
    await item.destroy();
  } catch (err) {
    req.flash("error_messages", messages.deleteError(titles.supply));
    res.redirect(`/specifications/supplies/${req.params.id}/delete`);
  } finally {
    req.flash("success_messages", messages.deleteSuccess(titles.supply, name));
    res.redirect("/specifications/supplies");
  }
});

module.exports = router;
