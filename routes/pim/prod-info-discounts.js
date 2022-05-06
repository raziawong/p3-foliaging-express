const router = require("express").Router();
const {
  getAllDiscounts,
  addDiscount,
  getDiscountById,
  updateDiscount,
} = require("../../database/access/discounts");
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const {
  createDiscountForm,
  uiFields,
} = require("../../helpers/form-operations");

router.get("/", async (req, res, next) => {
  const items = await getAllDiscounts();
  if (items) {
    res.render("listing/discounts", {
      discounts: items.toJSON(),
    });
  } else {
    fetchErrorHandler(next, "discounts");
  }
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
        title: titles.discount,
        form: form.toHTML(uiFields),
      });
    },
  });
});

router.get("/:id/update", async (req, res, next) => {
  const discount = await getDiscountById(req.params.id);

  if (discount) {
    const discountForm = createDiscountForm().bind({ ...discount.attributes });
    res.render("operations/update", {
      title: discount.toJSON().title,
      form: discountForm.toHTML(uiFields),
    });
  } else {
    fetchErrorHandler(next, "discount", req.params.id);
  }
});

router.post("/:id/update", async (req, res, next) => {
  const discount = await getDiscountById(req.params.id);

  if (discount) {
    const discountForm = createDiscountForm();
    discountForm.handle(req, {
      success: async (form) => {
        const updatedDiscount = await updateDiscount(discount, form.data);
        req.flash(
          variables.success,
          messages.updateSuccess(titles.discount, updatedDiscount.get("title"))
        );
        res.redirect("/products/discounts");
      },
      error: async (form) => {
        res.render("operations/update", {
          title: discount.toJSON().title,
          form: form.toHTML(uiFields),
        });
      },
    });
  } else {
    fetchErrorHandler(next, "discount", req.params.id);
  }
});

router.get("/:id/delete", async (req, res, next) => {
  const item = await getDiscountById(req.params.id);
  if (item) {
    res.render("operations/delete", {
      title: item.toJSON().title,
      homePath: "/products/discounts",
    });
  } else {
    fetchErrorHandler(next, "discount", req.params.id);
  }
});

router.post("/:id/delete", async (req, res) => {
  const item = await getDiscountById(req.params.id);
  const title = item.get("title");

  try {
    if (item) {
      await item.destroy();
      req.flash(
        variables.success,
        messages.deleteSuccess(titles.discount, title)
      );
      res.redirect("/products/discounts");
    }
  } catch (err) {
    req.flash(variables.error, messages.deleteError(titles.discount));
    res.redirect(`/discounts/${req.params.id}/delete`);
  }
});

module.exports = router;
