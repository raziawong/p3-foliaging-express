const router = require("express").Router();
const {
  getAllSupplies,
  getAllSupplyTypesOpts,
  getSupplyById,
  addSupply,
  updateSupply,
} = require("../../database/access/supplies");
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const { createSupplyForm, uiFields } = require("../../helpers/form-operations");

router.get("/", async (req, res, next) => {
  const items = await getAllSupplies();
  if (items) {
    res.render("listing/supplies", {
      supplies: items.toJSON(),
    });
  } else {
    fetchErrorHandler(next, "supplies");
  }
});

router.get("/create", async (req, res) => {
  const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
  res.render("operations/create", {
    title: titles.supply,
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
      req.session.save(() => {
        res.redirect("/specifications/supplies");
      });
    },
    error: async (form) => {
      res.render("operations/create", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/update", async (req, res, next) => {
  const supply = await getSupplyById(req.params.id);

  if (supply) {
    let supplyForm = createSupplyForm(await getAllSupplyTypesOpts());
    supplyForm = supplyForm.bind({ ...supply.attributes });

    res.render("operations/update", {
      title: supply.toJSON().name,
      form: supplyForm.toHTML(uiFields),
    });
  } else {
    fetchErrorHandler(next, "supply", req.params.id);
  }
});

router.post("/:id/update", async (req, res, next) => {
  const supply = await getSupplyById(req.params.id);

  if (supply) {
    const supplyForm = createSupplyForm(await getAllSupplyTypesOpts());

    supplyForm.handle(req, {
      success: async (form) => {
        const updatedSupply = await updateSupply(supply, form.data);
        req.flash(
          variables.success,
          messages.updateSuccess(titles.supply, updatedSupply.get("name"))
        );
        req.session.save(() => {
          res.redirect("/specifications/supplies");
        });
      },
      error: async (form) => {
        res.render("operations/update", {
          form: form.toHTML(uiFields),
        });
      },
    });
  } else {
    fetchErrorHandler(next, "supply", req.params.id);
  }
});

router.get("/:id/delete", async (req, res, next) => {
  const item = await getSupplyById(req.params.id);

  if (item) {
    res.render("operations/delete", {
      title: item.toJSON().name,
      homePath: "/specifications/supplies",
    });
  } else {
    fetchErrorHandler(next, "supply", req.params.id);
  }
});

router.post("/:id/delete", async (req, res) => {
  const item = await getSupplyById(req.params.id);

  try {
    if (item) {
      await item.destroy();

      req.flash(
        variables.success,
        messages.deleteSuccess(titles.supply, item.get("name"))
      );
      req.session.save(() => {
        res.redirect("/specifications/supplies");
      });
    }
  } catch (err) {
    req.flash(variables.error, messages.deleteError(titles.supply));
    req.session.save(() => {
      res.redirect(`/specifications/supplies/${req.params.id}/delete`);
    });
  }
});

module.exports = router;
