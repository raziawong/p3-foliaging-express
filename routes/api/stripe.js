const express = require("express");
const { deleteCartItemById } = require("../../database/access/cart-items");
const { addPaymentDetail } = require("../../database/access/payment-details");
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CustomerServices = require("../../database/services/customer-services");
const { apiMessages } = require("../../helpers/const");

router.post(
  "/process",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;

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
        await addPaymentDetail({
          payment_intent_id: paymentInfo.payment_intent,
          customer_email: paymentInfo.billing_details.email,
          amount: paymentInfo.amount,
          payment_status: paymentInfo.status,
          payment_method: paymentInfo.payment_method_details.type,
        });
      } else if (event.type == "checkout.session.completed") {
        const { object: checkoutInfo } = event.data;
        let shipping_type_id = null;
        const items = JSON.parse(checkoutInfo.metadata.orders);
        const shipping_address = JSON.parse(
          checkoutInfo.metadata.shipping_addr
        );
        const billing_address = JSON.parse(checkoutInfo.metadata.billing_addr);

        const customerService = new CustomerServices(
          checkoutInfo.client_reference_id
        );
        const shippingRate = await Stripe.shippingRates.retrieve(
          checkoutInfo.shipping_rate
        );

        if (shippingRate.hasOwnProperty("metadata")) {
          shipping_type_id = shippingRate.metadata.type_id;
        }

        const order = await customerService.insertOrderAndPayment({
          shipping_type_id,
          shipping_address,
          billing_address,
          total_amount: checkoutInfo.amount_total,
          items,
        });

        if (order && items) {
          if (checkoutInfo.metadata.cartIds) {
            const cartIds = JSON.parse(cartIds);
            for (const id of cartIds) {
              deleteCartItemById(id);
            }
          }
          for (const item of items) {
            updateProductStock(item.product_id, quantity);
          }
        }
      }

      res.send({ received: true });
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
