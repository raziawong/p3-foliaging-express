const router = require("express").Router();
const {
  getAllPlanterTypesOpts,
  getAllPlanterMaterialsOpts,
} = require("../../database/access/planters");
const { searchAndProcessProducts, likeKey } = require("../../helpers/const");

router.get("/", async (req, res) => {
  const queries = req.query;
  const builder = (qb) => {
    qb.whereNotNull("planter_id");

    if (queries.text || queries.type || queries.material) {
      qb.innerJoin("planters", "planters.id", "products.planter_id");

      if (queries.text) {
        qb.where("title", likeKey, "%" + queries.text + "%")
          .orWhere("planters.name", likeKey, "%" + queries.text + "%")
          .orWhere("planters.description", likeKey, "%" + queries.text + "%");
      }

      if (queries.type) {
        qb.where("planters.type_id", queries.type);
      }

      if (queries.material) {
        qb.where("planters.material_id", queries.material);
      }
    }

    if (queries.color) {
      qb.where("products.color_id", queries.color);
    }

    if (queries.min_price) {
      qb.where("price", ">=", queries.min_price * 100);
    }

    if (queries.max_price) {
      qb.where("price", "<=", queries.max_price * 100);
    }
  };

  const results = await searchAndProcessProducts(builder);
  res.send({ planters: results });
});

router.get("/types", async (req, res) => {
  const results = await getAllPlanterTypesOpts();
  res.send({ types: results });
});

router.get("/materials", async (req, res) => {
  const results = await getAllPlanterMaterialsOpts();
  res.send({ materials: results });
});

module.exports = router;
