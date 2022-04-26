const router = require("express").Router();
const { getAllPlanters } = require("../../database/access/planters");
const { getAllPlants } = require("../../database/access/plants");
const { getAllSupplies } = require("../../database/access/supplies");

router.get("/", async (req, res) => {
  res.redirect("/products");
});

router.get("/plants", async (req, res) => {
  const items = await getAllPlants();
  res.render("specifications/plants/index", {
    plants: items.toJSON(),
  });
});

router.get("/planters", async (req, res) => {
  const items = await getAllPlanters();
  res.render("specifications/planters/index", {
    planters: items.toJSON(),
  });
});

router.get("/supplies", async (req, res) => {
  const plants = await getAllSupplies();
  res.render("specifications/supplies/index", {
    supplies: items.toJSON(),
  });
});

module.exports = router;
