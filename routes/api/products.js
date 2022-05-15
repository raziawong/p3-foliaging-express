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

  router.get("/", async (req, res) => {
    const queries = req.query;
    const builder = (qb) => {
      if (queries.title) {
        qb.where("title", likeKey, "%" + queries.title + "%");
      }

      if (queries.min_price) {
        qb.where("price", ">=", queries.min_price * 100);
      }

      if (queries.max_price) {
        qb.where("price", "<=", queries.max_price * 100);
      }
    };
    const results = await searchAndProcessProducts(builder);
    res.send({ products: results });
  });
})();

module.exports = router;
