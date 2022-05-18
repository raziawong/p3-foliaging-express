const router = require("express").Router();
const CartServices = require("../../database/services/cart-services");

router.get("/", async (req, res) => {
  const customer = req.user || null;
  let resp = {};

  if (customer && customer.id) {
    resp = await new CartServices(customer.id).getCart();
  }

  res.send({ items: resp });
});

router.post("/add", async (req, res) => {
  const { pid } = req.body;
  const customer = req.user || null;
  let resp = {};

  if (customer && customer.id && pid) {
    resp = await new CartServices(customer.id).addItemToCart(pid, 1);
  }

  res.send({ item: resp });
});

router.delete("/remove", async (req, res) => {
  const { pid } = req.query;
  const customer = req.user || null;
  let resp = { success: false };

  if (customer && customer.id && pid) {
    const results = await new CartServices(customer.id).removeItemFromCart(pid);
    resp = { success: true, item: results };
  }

  res.send(resp);
});

router.patch("/quantity/update", async (req, res) => {
  const { pid, quantity } = req.body;
  const customer = req.user || null;
  let resp = {};

  if (customer && customer.id && pid) {
    resp = await new CartServices(customer.id).setItemQuantity(pid, quantity);
  }

  res.send({ item: resp });
});

router.get("/quantity/check", async (req, res) => {
  const { pid, quantity } = req.query;
  const customer = req.user || null;
  let resp = {};

  if (customer && customer.id && pid) {
    resp = await new CartServices(customer.id).verifyStockQuantity(
      pid,
      quantity
    );
  }

  res.send({ resp });
});

module.exports = router;
