const router = require("express").Router();
const {
  getAllPlanterTypesOpts,
  getAllPlanterMaterialsOpts,
} = require("../../database/access/planters");
const { searchAndProcessProducts, likeKey } = require("../../helpers/const");

router.get("/:sortField/:sortOrder", async (req, res) => {
  const queries = req.query;
  const params = req.params;

  const builder = (qb) => {
    qb.whereNotNull("planter_id");

    if (queries.text || queries.planterType || queries.material) {
      qb.innerJoin("planters", "planters.id", "products.planter_id");

      if (queries.text) {
        qb.where("title", likeKey, "%" + queries.text + "%")
          .orWhere("planters.name", likeKey, "%" + queries.text + "%")
          .orWhere("planters.description", likeKey, "%" + queries.text + "%");
      }

      if (queries.planterType) {
        qb.where("planters.type_id", queries.planterType);
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

    qb.orderBy(params.sortField, params.sortOrder);
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
