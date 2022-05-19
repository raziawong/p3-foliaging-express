const express = require("express");
const { deleteCartItemById } = require("../../database/access/cart-items");
const { addPaymentDetail } = require("../../database/access/payment-details");
const { updateProductStock } = require("../../database/access/products");
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CustomerServices = require("../../database/services/customer-services");
const { apiMessages } = require("../../helpers/const");

router.post(
  "/process",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;
    let resp = {};

    try {
      event = Stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        process.env.STRIPE_ENDPOINT_SECRET
      );
    } catch (err) {
      console.error(err.message);
      res.status(406);
      res.send({ error: err.message });
    }

    if (event) {
      if (event.type == "charge.succeeded") {
        const { object: paymentInfo } = event.data;
        resp = await addPaymentDetail({
          payment_intent_id: paymentInfo.payment_intent,
          customer_email: paymentInfo.billing_details.email,
          amount: paymentInfo.amount,
          receipt_url: paymentInfo.receipt_url,
          payment_status: paymentInfo.status,
          payment_method: paymentInfo.payment_method_details.type,
        });
      } else if (event.type == "checkout.session.completed") {
        const { object: checkoutInfo } = event.data;
        const { orders, shipping_addr, billing_addr, cartIds } =
          checkoutInfo.metadata;
        let shipping_type_id = null;
        const items = orders ? JSON.parse(orders) : null;
        const shipping_address = shipping_addr
          ? JSON.parse(shipping_addr)
          : null;
        const billing_address = billing_addr ? JSON.parse(billing_addr) : null;

        const customerService = new CustomerServices(
          Number(checkoutInfo.client_reference_id)
        );
        const shippingRate = await Stripe.shippingRates.retrieve(
          checkoutInfo.shipping_rate
        );

        if (shippingRate.hasOwnProperty("metadata")) {
          shipping_type_id = Number(shippingRate.metadata.type_id);
        }

        resp = await customerService.insertOrderAndPayment({
          shipping_type_id,
          shipping_address,
          billing_address,
          payment_intent_id: checkoutInfo.payment_intent,
          total_amount: checkoutInfo.amount_total,
          items,
        });

        if (resp && items) {
          if (checkoutInfo.metadata.cartIds) {
            let cart = JSON.parse(cartIds);
            for (const id of cart) {
              deleteCartItemById(id);
            }
          }
          for (const item of items) {
            updateProductStock(item.product_id, item.quantity);
          }
        }
      }

      res.send({ type: event.type, inserted: resp });
    }
  }
);

router.get("/success", (req, res) => {
  res.send({ success: true, message: apiMessages.paymentSuccess });
});

router.get("/cancel", (req, res) => {
  res.send({ success: false, message: apiMessages.paymentCancelled });
});

module.exports = router;
