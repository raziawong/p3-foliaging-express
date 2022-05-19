const { getProductById } = require("../../database/access/products");
const ProductServices = require("../../database/services/product-services");
const { searchAndProcessProducts, likeKey } = require("../../helpers/const");

const router = require("express").Router();

const types = {
  plants: require("./products-plants"),
  planters: require("./products-planters"),
  supplies: require("./products-supplies"),
};

(async function () {
  router.use("/plants", types.plants);
  router.use("/planters", types.planters);
  router.use("/supplies", types.supplies);

  router.get("/details", async (req, res) => {
    const { pid } = req.query;

    const results = await getProductById(pid);
    let product = {};
    if (results) {
      product = results.toJSON();
      const productService = new ProductServices(product.id, product.discounts);

      if (product.uploadcare_group_id) {
        product.images = await productService.getImagesUrls();
      }

      product.deals = productService.getDeals();
    }

    res.send({ details: product });
  });

  router.get("/:sortField/:sortOrder", async (req, res) => {
    const queries = req.query;
    const params = req.params;

    const builder = (qb) => {
      if (queries.text) {
        qb.leftOuterJoin("plants", "products.plant_id", "plants.id")
          .leftOuterJoin("planters", "planters.id", "products.planter_id")
          .leftOuterJoin("supplies", "supplies.id", "products.supply_id");

        qb.where("title", likeKey, "%" + queries.text + "%")
          .orWhere("plants.name", likeKey, "%" + queries.text + "%")
          .orWhere("plants.alias", likeKey, "%" + queries.text + "%")
          .orWhere("plants.description", likeKey, "%" + queries.text + "%")
          .orWhere("planters.name", likeKey, "%" + queries.text + "%")
          .orWhere("planters.description", likeKey, "%" + queries.text + "%")
          .orWhere("supplies.name", likeKey, "%" + queries.text + "%")
          .orWhere("supplies.description", likeKey, "%" + queries.text + "%");
      }

      if (queries.min_price) {
        qb.where("price", ">=", queries.min_price * 100);
      }

      if (queries.max_price) {
        qb.where("price", "<=", queries.max_price * 100);
      }

      qb.orderBy(params.sortField, params.sortOrder);
    };

    const results = await searchAndProcessProducts(builder);
    res.send({ products: results });
  });
})();

module.exports = router;
