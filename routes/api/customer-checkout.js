const router = require("express").Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getAllShippingTypes } = require("../../database/access/orders");
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
      let shippingTypes = await getAllShippingTypes();

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
        let totalPrice = 0;
        let shippingOptions = [];
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

          totalPrice += lineItem.amount * lineItem.quantity;
          lineItems.push(lineItem);

          meta.push({
            product_id: pid,
            quantity: item.get("quantity"),
          });
        }

        if (shippingTypes) {
          shippingTypes = shippingTypes.toJSON();

          for (const st of shippingTypes) {
            if (
              totalPrice >= st.min_cart_amount &&
              totalPrice <= st.max_cart_amount
            ) {
              shippingOptions.push({
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: {
                    amount: st.price,
                    currency: variables.currency,
                  },
                  display_name: st.name,
                  delivery_estimate: {
                    minimum: {
                      unit: "business_day",
                      value: st.min_day,
                    },
                    maximum: {
                      unit: "business_day",
                      value: st.max_day,
                    },
                  },
                  metadata: {
                    type_id: st.id,
                  },
                },
              });
            }
          }
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

        if (shippingOptions.length) {
          session.shipping_options = shippingOptions;
        }

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

module.exports = router;
