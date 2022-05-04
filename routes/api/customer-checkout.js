const express = require("express");
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CartServices = require("../../database/services/cart-services");
const CustomerServices = require("../../database/services/customer-services");
const ImageServices = require("../../database/services/image-services");
const { variables, apiMessages } = require("../../helpers/const");

router.get("/", async (req, res) => {
  const { cid } = req.query;

  if (cid) {
    try {
      const cartItems = await new CartServices(cid).getCart();
      const customerService = await new CustomerServices(cid);

      let lineItems = [];
      let meta = [];
      for (let item of cartItems) {
        const pid = item.get("product_id");

        const lineItem = {
          name: item.related("product").get("title"),
          amount: item.related("product").get("price") * 100,
          quantity: item.get("quantity"),
          currency: variables.currency,
        };
        if (item.related("product").get("uploadcare_group_id")) {
          lineItem["images"] = await new ImageServices(pid).getImagesUrls();
        }
        lineItems.push(lineItem);

        meta.push({
          product_id: pid,
          quantity: item.get("quantity"),
        });
      }

      let metaData = JSON.stringify(meta);
      const session = {
        customer_email: (await customerService.getCustomer()).get("email"),
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url:
          process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
        cancel_url: process.env.STRIPE_CANCEL_URL,
        metadata: {
          cid: cid,
          // address: aid,
          orders: metaData,
        },
      };

      let stripeSession = await Stripe.checkout.sessions.create(session);
      res.send(stripeSession);
    } catch (err) {
      console.error(err.message);
      res.status(406);
      res.send({ error: err.message });
    }
  } else {
    res.status(406);
    res.send({ error: apiMessages.notAcceptable });
  }
});

router.post(
  "/process",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_ENDPOINT_SECRET
      );
    } catch (err) {
      console.error(err.message);
      res.status(406);
      res.send({ error: err.message });
    }

    if (event.type == "checkout.session.completed") {
      let stripeSession = event.data.object;
      console.log(stripeSession);
      console.log(stripeSession.metadata);
      // process stripeSession
    }
    res.send({ received: true });
  }
);

router.get("/success", (req, res) => {
  res.send({ success: true, message: apiMessages.paymentSuccess });
});

router.get("/cancel", (req, res) => {
  res.send({ success: false, message: apiMessages.paymentCancelled });
});

module.exports = router;
