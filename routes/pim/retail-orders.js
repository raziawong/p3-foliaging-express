const router = require("express").Router();
const {
  getAllDiscounts,
  addDiscount,
  getDiscountById,
  updateDiscount,
} = require("../../database/access/discounts");
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const {
  createDiscountForm,
  uiFields,
} = require("../../helpers/form-operations");

router.get("/", async (req, res, next) => {
  res.send("Discounts");
});

module.exports = router;
