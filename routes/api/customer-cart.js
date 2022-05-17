const router = require("express").Router();
const CartServices = require("../../database/services/cart-services");

router.get("/", async (req, res) => {
  const { cid } = req.query;
  let resp = {};

  if (cid) {
    resp = await new CartServices(cid).getCart();
  }

  res.send({ items: resp });
});

router.post("/add", async (req, res) => {
  const { cid, pid } = req.body;
  let resp = {};

  if (cid && pid) {
    resp = await new CartServices(cid).addItemToCart(pid, 1);
  }

  res.send({ item: resp });
});

router.delete("/remove", async (req, res) => {
  const { cid, pid } = req.query;
  let resp = { success: false };

  if (cid && pid) {
    const removed = await new CartServices(cid).removeItemFromCart(pid);
    resp = { success: true, item: resp };
  }

  res.send(resp);
});

router.patch("/quantity/update", async (req, res) => {
  const { cid, pid, quantity } = req.body;
  let resp = {};

  if (cid && pid) {
    resp = await new CartServices(cid).setItemQuantity(pid, quantity);
  }

  res.send({ item: resp });
});

router.get("/quantity/check", async (req, res) => {
  const { cid, pid, quantity } = req.query;
  let resp = {};

  if (cid && pid) {
    resp = await new CartServices(cid).verifyStockQuantity(pid, quantity);
  }

  res.send({ resp });
});

module.exports = router;
