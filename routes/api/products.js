const router = require("express").Router();
const { getAllProducts } = require("../../database/access/products");
const ImageServices = require("../../database/services/image-services");

router.get("/", async (req, res) => {
  let products = await getAllProducts();

  if (products) {
    products = products.toJSON();
    for (const item of products) {
      if (item.uploadcare_group_id) {
        item.images = await new ImageServices(item.id).getImagesUrls();
      }
    }
  }

  res.send(products);
});

module.exports = router;
