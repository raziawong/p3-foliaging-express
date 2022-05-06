const express = require("express");
const { addPaymentDetail } = require("../../database/access/payment-details");
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const CartServices = require("../../database/services/cart-services");
const CustomerServices = require("../../database/services/customer-services");
const ImageServices = require("../../database/services/image-services");
const { variables, apiMessages, messages } = require("../../helpers/const");

router.get("/", async (req, res) => {
  let { cid, shipping_id } = req.query;
  cid = Number(cid);
  shipping_id = Number(shipping_id);

  if (cid && shipping_id) {
    try {
      const cartItems = await new CartServices(cid).getCart();
      const customerService = await new CustomerServices(cid);
      let hasError = false;

      if (!(await customerService.getCustomer())) {
        hasError = true;
        res.status(406);
        res.send({ error: messages.customerInvalid(cid) });
      } else if (!cartItems) {
        hasError = true;
        res.status(406);
        res.send({ error: messages.cartEmpty(cid) });
      } else if (!(await customerService.hasAddress(shipping_id))) {
        hasError = true;
        res.status(406);
        res.send({ error: messages.shippingAddressInvalid(cid, shipping_id) });
      }

      if (!hasError) {
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
          payment_method_types: ["card", "grabpay", "paynow"],
          line_items: lineItems,
          success_url:
            process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
          cancel_url: process.env.STRIPE_CANCEL_URL,
          client_reference_id: cid,
          metadata: {
            shipping_id,
            orders: metaData,
          },
        };

        const stripeSession = await Stripe.checkout.sessions.create(session);
        res.send(stripeSession);
      }
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
      event = Stripe.webhooks.constructEvent(
        payloadString,
        header,
        process.env.STRIPE_ENDPOINT_SECRET
      );
    } catch (err) {
      console.error(err.message);
      res.status(406);
      res.send({ error: err.message });
    }

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

      await customerService.insertOrderAndPayment({
        shipping_address_id: checkoutInfo.shipping_id,
        total_amount: checkoutInfo.amount_total,
        items: JSON.parse(checkoutInfo.orders),
      });
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
