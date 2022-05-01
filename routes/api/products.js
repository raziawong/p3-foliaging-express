const { getAllProducts } = require("../../database/access/products");

const router = require("express").Router();

router.get("/", async (req, res) => {
  res.send(await getAllProducts());
});

module.exports = router;
