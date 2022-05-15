const router = require("express").Router();
const { searchProducts } = require("../../database/access/products");
const ProductServices = require("../../database/services/product-services");

const searchAndProcessProducts = async (builder) => {
  let products = await searchProducts(builder);

  if (products) {
    products = products.toJSON();
    for (const item of products) {
      const productService = new ProductServices(item.id, item.discounts);

      if (item.uploadcare_group_id) {
        item.images = await productService.getImagesUrls();
      }

      item.deals = productService.getDeals();
    }
  }

  return products;
};

router.get("/", async (req, res) => {
  const queries = req.query;
  const builder = (qb) => {};
  const results = await searchAndProcessProducts(builder);
  res.send(results);
});

router.get("/plants", async (req, res) => {
  const queries = req.query;
  const builder = (qb) => {
    qb.whereNotNull("plant_id");
  };

  const results = await searchAndProcessProducts(builder);
  res.send(results);
});

router.get("/planters", async (req, res) => {
  const queries = req.query;
  const builder = (qb) => {
    qb.whereNotNull("planter_id");
  };

  const results = await searchAndProcessProducts(builder);
  res.send(results);
});

router.get("/supplies", async (req, res) => {
  const queries = req.query;
  const builder = (qb) => {
    qb.whereNotNull("supply_id");
  };

  const results = await searchAndProcessProducts(builder);
  res.send(results);
});

module.exports = router;
