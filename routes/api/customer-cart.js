const router = require("express").Router();
const CartServices = require("../../database/services/cart-services");

router.get("/", async (req, res) => {
  const { cid } = req.query;
  let resp = {};

  if (cid) {
    resp = new CartServices(cid).getCart();
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
  let resp = {};

  if (cid && pid) {
    resp = await new CartServices(cid).removeItemFromCart(pid);
  }

  res.send({ details: resp });
});

router.patch("/quantity/update", async (req, res) => {
  const { cid, pid, quantity } = req.body;
  let resp = {};

  if (cid && pid) {
    resp = await new CartServices(cid).setItemQuantity(pid, quantity);
  }

  res.send({ item: resp });
});

module.exports = router;
