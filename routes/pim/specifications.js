const router = require("express").Router();
const spec = {
  plants: require("./spec-plants"),
  planters: require("./spec-planters"),
  supplies: require("./spec-supplies"),
};

(async function () {
  router.get("/", async (req, res) => {
    res.redirect("/products");
  });

  router.use("/plants", spec.plants);
  router.use("/planters", spec.planters);
  router.use("/supplies", spec.supplies);
})();

module.exports = router;
