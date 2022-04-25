const router = require("express").Router();
const { getAllProducts } = require("../../database/access/products");

router.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.render("products/index", {
    products: products.toJSON(),
  });
});

module.exports = router;
