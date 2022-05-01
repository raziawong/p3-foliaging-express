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
  searchProducts,
  getAllSpecificationsOpts,
} = require("../../database/access/products");
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const {
  createProductForm,
  uiFields,
  updateProductForm,
  createSearchForm,
} = require("../../helpers/form-operations");

const prodInfo = {
  discounts: require("./prod-info-discounts"),
};

(async function () {
  router.use("/discounts", prodInfo.discounts);

  router.get("/", async (req, res, next) => {
    const consolidateSpecs = (products) => {
      products = products.map((item) => {
        item.specification = item.plant_id
          ? item.plant
          : item.planter_id
          ? item.planter
          : item.supply_id
          ? item.supply
          : {};
        return item;
      });
      return products;
    };
    const showAllProducts = async (form) => {
      let products = await getAllProducts();
      if (products) {
        products = consolidateSpecs(products.toJSON());
        res.render("listing/products", {
          form: form.toHTML(uiFields),
          products: products,
        });
      } else {
        fetchErrorHandler(next, "products");
      }
    };
    const showQueriedProducts = async (form) => {
      const queries = req.query;
      const builder = (qb) => {
        if (queries.title) {
          qb.where("title", "LIKE", "%" + queries.title + "%");
        }
        if (queries.specification) {
          const specs = queries.specification.split("_");
          const id =
            specs[0] === "plants"
              ? "plant_id"
              : specs[0] === "planters"
              ? "planter_id"
              : "supply_id";

          qb.join(specs[0], id, specs[0].concat(".id")).where(
            specs[0].concat(".name"),
            "=",
            specs[1]
          );
        }
        if (queries.min_price) {
          qb.where("price", ">=", queries.min_price * 100);
        }
        if (queries.max_price) {
          qb.where("price", "<=", queries.max_price * 100);
        }
        if (queries.min_stock) {
          qb.where("stock", ">=", queries.min_stock);
        }
        if (queries.max_stock) {
          qb.where("stock", "<=", queries.max_stock);
        }
        if (queries.color_id) {
          qb.join("colors", "colors.id", "color_id").where(
            "id",
            "=",
            queries.color_id
          );
        }
        if (queries.size_id) {
          qb.join("sizes", "sizes.id", "size_id").where(
            "id",
            "=",
            queries.size_id
          );
        }
        if (queries.discounts) {
          qb.join("discounts_products", "products.id", "product_id").where(
            "discount_id",
            "in",
            queries.discounts.split(",")
          );
        }
      };
      const products = await searchProducts(builder);
      res.render("listing/products", {
        form: form.toHTML(uiFields),
        products: products.toJSON(),
      });
    };

    const searchForm = createSearchForm(
      await getAllSpecificationsOpts(),
      await getAllDiscountsOpts(),
      await getAllColorsOpts(),
      await getAllSizesOpts()
    );
    searchForm.handle(req, {
      empty: (form) => {
        showAllProducts(form);
      },
      success: async (form) => {
        showQueriedProducts(form);
      },
      error: (form) => {
        showAllProducts(form);
      },
    });
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
    const renderForm = (form) => {
      res.render("operations/create", {
        needImage: true,
        publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
        title: titles.product,
        form: form.toHTML(uiFields),
      });
    };
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
        const { plant_id, planter_id, supply_id } = form.data;
        if (plant_id || planter_id || supply_id) {
          const product = await addProduct(form.data);
          req.flash(
            variables.success,
            messages.createSuccess(titles.product, product.get("name"))
          );
          res.redirect("/products");
        } else {
          req.flash(
            variables.error,
            "Either Plant, Planter or Supply needs to be selected"
          );
          renderForm(form);
        }
      },
      error: async (form) => {
        renderForm(form);
      },
    });
  });

  router.get("/:id/update", async (req, res, next) => {
    const product = await getProductById(req.params.id);

    if (product) {
      const productObj = product.toJSON();
      let productForm = updateProductForm(
        await getAllDiscountsOpts(),
        await getAllColorsOpts(),
        await getAllSizesOpts()
      );
      let selected = await product.related("discounts").pluck("id");
      productForm = productForm.bind({
        ...product.attributes,
        discounts: selected,
      });
      const specification =
        productObj.plant || productObj.planter || productObj.supply;
      res.render("operations/update", {
        needImage: true,
        publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
        specification: specification.name,
        title: productObj.title,
        form: productForm.toHTML(uiFields),
      });
    } else {
      fetchErrorHandler(next, "product", req.params.id);
    }
  });

  router.post("/:id/update", async (req, res, next) => {
    const product = await getProductById(req.params.id);

    if (product) {
      const productForm = updateProductForm(
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
          const productObj = product.toJSON();
          const specification =
            productObj.plant || productObj.planter || productObj.supply;
          res.render("operations/update", {
            needImage: true,
            publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
            specification: specification.name,
            title: productObj.title,
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
