const router = require("express").Router();
const { getAllSupplyTypesOpts } = require("../../database/access/supplies");
const { searchAndProcessProducts, likeKey } = require("../../helpers/const");

router.get("/:sortField/:sortOrder", async (req, res) => {
  const queries = req.query;
  const params = req.params;

  const builder = (qb) => {
    qb.whereNotNull("supply_id");

    if (queries.text || queries.supplyType) {
      qb.innerJoin("supplies", "supplies.id", "products.supply_id");

      if (queries.text) {
        qb.where("title", likeKey, "%" + queries.text + "%")
          .orWhere("supplies.name", likeKey, "%" + queries.text + "%")
          .orWhere("supplies.description", likeKey, "%" + queries.text + "%");
      }

      if (queries.type) {
        qb.where("supplies.type_id", queries.supplyType);
      }
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
  res.send({ supplies: results });
});

router.get("/types", async (req, res) => {
  const results = await getAllSupplyTypesOpts();
  res.send({ types: results });
});

module.exports = router;
