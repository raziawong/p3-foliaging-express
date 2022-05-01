const router = require("express").Router();
const { getAllProducts } = require("../../database/access/products");

router.get("/", async (req, res) => {
  res.send(await getAllProducts());
});

module.exports = router;
