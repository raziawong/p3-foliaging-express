const router = require("express").Router();
const {
  getProductById,
  getAllProducts,
  addProduct,
  updateProduct,
  getAllColorsOpts,
  getAllSizesOpts,
  getAllDiscountsOpts,
  getAllPlantsOpts,
  getAllPlantersOpts,
  getAllSuppliesOpts,
} = require("../../database/access/products");
const { messages, titles, variables } = require("../../helpers/const");
const { createProductForm, uiFields } = require("../../helpers/form");

const prodInfo = {
  discounts: require("./prod-info-discounts"),
};

(async function () {
  router.use("/discounts", prodInfo.discounts);

  router.get("/", async (req, res, next) => {
    let items = await getAllProducts();
    if (items) {
      items = items.toJSON().map((item) => {
        item.specification = item.plant_id
          ? item.plant
          : item.planter_id
          ? item.planter
          : item.supply_id
          ? item.supply
          : {};
        return item;
      });
      res.render("listing/products", {
        products: items,
      });
    } else {
      fetchErrorHandler(next, "products");
    }
  });

  router.get("/create", async (req, res) => {
    const productForm = createProductForm(
      await getAllPlantsOpts(),
      await getAllPlantersOpts(),
      await getAllSuppliesOpts(),
      await getAllDiscountsOpts(),
      await getAllColorsOpts(),
      await getAllSizesOpts()
    );
    res.render("operations/create", {
      needImage: true,
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
      title: titles.product,
      form: productForm.toHTML(uiFields),
    });
  });

  router.post("/create", async (req, res) => {
    const productForm = createProductForm(
      await getAllPlantsOpts(),
      await getAllPlantersOpts(),
      await getAllSuppliesOpts(),
      await getAllDiscountsOpts(),
      await getAllColorsOpts(),
      await getAllSizesOpts()
    );
    productForm.handle(req, {
      success: async (form) => {
        const product = await addProduct(form.data);
        req.flash(
          variables.success,
          messages.createSuccess(titles.product, product.get("name"))
        );
        res.redirect("/products");
      },
      error: async (form) => {
        res.render("operations/create", {
          needImage: true,
          publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
          title: titles.product,
          form: form.toHTML(uiFields),
        });
      },
    });
  });

  router.get("/:id/update", async (req, res, next) => {
    const product = await getProductById(req.params.id);

    if (product) {
      let productForm = createProductForm(
        await getAllPlantsOpts(),
        await getAllPlantersOpts(),
        await getAllSuppliesOpts(),
        await getAllDiscountsOpts(),
        await getAllColorsOpts(),
        await getAllSizesOpts()
      );
      const { discounts, ...dbData } = product.attributes;
      let selected = await product.related("discounts").pluck("id");
      productForm = productForm.bind({
        ...dbData,
        discounts: selected,
      });
      res.render("operations/update", {
        needImage: true,
        publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
        title: product.toJSON().title,
        form: productForm.toHTML(uiFields),
      });
    } else {
      fetchErrorHandler(next, "product", req.params.id);
    }
  });

  router.post("/:id/update", async (req, res, next) => {
    const product = await getProductById(req.params.id);

    if (product) {
      const productForm = createProductForm(
        await getAllPlantsOpts(),
        await getAllPlantersOpts(),
        await getAllSuppliesOpts(),
        await getAllDiscountsOpts(),
        await getAllColorsOpts(),
        await getAllSizesOpts()
      );
      productForm.handle(req, {
        success: async (form) => {
          const updatedProduct = await updateProduct(product, form.data);
          req.flash(
            variables.success,
            messages.updateSuccess(titles.product, updatedProduct.get("name"))
          );
          res.redirect("/products");
        },
        error: async (form) => {
          res.render("operations/update", {
            needImage: true,
            publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
            title: product.toJSON().title,
            form: form.toHTML(uiFields),
          });
        },
      });
    } else {
      fetchErrorHandler(next, "product", req.params.id);
    }
  });

  router.get("/:id/delete", async (req, res, next) => {
    const item = await getProductById(req.params.id);
    if (item) {
      res.render("operations/delete", {
        title: item.toJSON().title,
        homePath: "/products",
      });
    } else {
      fetchErrorHandler(next, "product", req.params.id);
    }
  });

  router.post("/:id/delete", async (req, res) => {
    const item = await getProductById(req.params.id);
    const title = item.get("title");

    try {
      if (item) {
        await item.destroy();
      }
    } catch (err) {
      req.flash(variables.error, messages.deleteError(titles.product));
      res.redirect(`/products/${req.params.id}/delete`);
    } finally {
      req.flash(
        variables.success,
        messages.deleteSuccess(titles.product, title)
      );
      res.redirect("/products");
    }
  });
})();

module.exports = router;
