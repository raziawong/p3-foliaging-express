const express = require("express");
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
          customer_email: paymentInfo.billing_dettails.email,
          amount: paymentInfo.amount,
          payment_status: paymentInfo.status,
          payment_method: paymentInfo.payment_method_details.type,
        });
      } else if (event.type == "checkout.session.completed") {
        const { object: checkoutInfo } = event.data;
        const customerService = new CustomerServices(
          checkoutInfo.client_reference_id
        );
        const shippingRate = await Stripe.shippingRates.retrieve(
          checkoutInfo.shipping_rate
        );

        let shipping_type_id = null;
        if (shippingRate.hasOwnProperty("metadata")) {
          shipping_type_id = shippingRate.metadata.type_id;
        }

        await customerService.insertOrderAndPayment({
          shipping_type_id,
          shipping_address_id: checkoutInfo.shipping_id,
          total_amount: checkoutInfo.amount_total,
          items: JSON.parse(checkoutInfo.orders),
        });
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
