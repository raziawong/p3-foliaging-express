const router = require("express").Router();
const {
  getAllDiscounts,
  addDiscount,
  getDiscountById,
  updateDiscount,
} = require("../../database/access/discounts");
const { messages, titles, variables } = require("../../helpers/const");
const { createDiscountForm, uiFields } = require("../../helpers/form");

router.get("/", async (req, res) => {
  const items = await getAllDiscounts();
  res.render("listing/discounts", {
    discounts: items.toJSON(),
  });
});

router.get("/create", async (req, res) => {
  const discountForm = createDiscountForm();
  res.render("operations/create", {
    title: titles.discount,
    form: discountForm.toHTML(uiFields),
  });
});

router.post("/create", async (req, res) => {
  const discountForm = createDiscountForm();
  discountForm.handle(req, {
    success: async (form) => {
      const discount = await addDiscount(form.data);
      req.flash(
        variables.success,
        messages.createSuccess(titles.discount, discount.get("title"))
      );
      res.redirect("/products/discounts");
    },
    error: async (form) => {
      res.render("operations/create", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/update", async (req, res) => {
  const discount = await getDiscountById(req.params.id);
  const discountForm = createDiscountForm().bind({ ...discount.attributes });
  res.render("operations/update", {
    title: discount.toJSON().title,
    form: discountForm.toHTML(uiFields),
  });
});

router.post("/:id/update", async (req, res) => {
  const discountForm = createDiscountForm();
  discountForm.handle(req, {
    success: async (form) => {
      const discount = await updateDiscount(req.params.id, form.data);
      req.flash(
        variables.success,
        messages.updateSuccess(titles.discount, discount.get("title"))
      );
      res.redirect("/products/discounts");
    },
    error: async (form) => {
      res.render("operations/update", {
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/delete", async (req, res) => {
  const item = await getDiscountById(req.params.id);
  res.render("operations/delete", {
    title: item.toJSON().title,
    homePath: "/products/discounts",
  });
});

router.post("/:id/delete", async (req, res) => {
  const item = await getDiscountById(req.params.id);
  const title = item.get("title");

  try {
    if (item) {
      await item.destroy();
    }
  } catch (err) {
    req.flash(variables.error, messages.deleteError(titles.discount));
    res.redirect(`/discounts/${req.params.id}/delete`);
  } finally {
    req.flash(
      variables.success,
      messages.deleteSuccess(titles.discount, title)
    );
    res.redirect("/products/discounts");
  }
});

module.exports = router;
