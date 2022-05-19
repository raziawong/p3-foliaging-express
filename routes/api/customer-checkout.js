const router = require("express").Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { getAddressById } = require("../../database/access/addresses");
const { getAllShippingTypes } = require("../../database/access/orders");
const CartServices = require("../../database/services/cart-services");
const CustomerServices = require("../../database/services/customer-services");
const ProductServices = require("../../database/services/product-services");
const { variables, apiMessages, messages } = require("../../helpers/const");

router.get("/", async (req, res) => {
  const customer = req.user || null;
  let {
    shipping_id,
    billing_id,
    first_name,
    last_name,
    contact_number,
    coupon,
  } = req.query;
  shipping_id = Number(shipping_id);
  billing_id = Number(billing_id);

  if (customer && customer.id && shipping_id && billing_id) {
    const cid = customer.id;

    try {
      const cartItems = await new CartServices(cid).getCart();
      const customerService = new CustomerServices(cid);
      const dbCustomer = await customerService.getCustomer();
      let shippingTypes = await getAllShippingTypes();

      let hasError = false;

      if (!dbCustomer) {
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
        res.send({ error: messages.addressInvalid(cid, shipping_id) });
      } else if (!(await customerService.hasAddress(billing_id))) {
        hasError = true;
        res.status(406);
        res.send({ error: messages.addressInvalid(cid, billing_id) });
      }

      if (dbCustomer) {
        let toUpdate = {
          first_name: dbCustomer.get("first_name"),
          last_name: dbCustomer.get("last_name"),
          contact_number: dbCustomer.get("contact_number"),
        };

        if (first_name && toUpdate.first_name !== first_name) {
          toUpdate.first_name = first_name;
        }

        if (last_name && toUpdate.last_name !== last_name) {
          toUpdate.last_name = last_name;
        }

        if (contact_number && toUpdate.contact_number !== contact_number) {
          toUpdate.contact_number = contact_number;
        }

        customerService.updateAccount(toUpdate);
      }

      if (!hasError) {
        let totalPrice = 0;
        let shippingOptions = [];
        let shipping_addr = {};
        let billing_addr = {};
        let cartIds = [];
        let lineItems = [];
        let meta = [];

        for (let item of cartItems) {
          const pid = item.product_id;

          const productService = new ProductServices(
            item.product_id,
            item.product.discounts
          );
          const discount_percentage = coupon
            ? productService.getCouponDiscount(coupon)
            : productService.getLatestDeal();

          let disconted_price =
            item.product.price * ((100 - discount_percentage) / 100);

          const lineItem = {
            name: item.product.title,
            amount: disconted_price * 100,
            quantity: item.quantity,
            currency: variables.currency,
          };

          if (item.product.uploadcare_group_id) {
            lineItem["images"] = await productService.getImagesUrls();
          }

          totalPrice += lineItem.amount * lineItem.quantity;
          lineItems.push(lineItem);

          meta.push({
            product_id: pid,
            price: disconted_price,
            discounted_price: discount_percentage ? disconted_price : 0,
            quantity: item.quantity,
          });

          cartIds.push(item.id);
        }

        if (shipping_id) {
          const addr = await getAddressById(shipping_id);
          if (addr) shipping_addr = JSON.stringify(addr.toJSON());
        }

        if (billing_id === shipping_id) {
          billing_addr = shipping_addr;
        } else if (billing_id) {
          const addr = await getAddressById(billing_id);
          if (addr) billing_addr = JSON.stringify(addr.toJSON());
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
                    amount: st.price * 100,
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

        let orderMeta = JSON.stringify(meta);
        const session = {
          customer_email: (await customerService.getCustomer()).get("email"),
          payment_method_types: ["card", "grabpay", "paynow"],
          line_items: lineItems,
          success_url:
            process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
          cancel_url: process.env.STRIPE_CANCEL_URL,
          client_reference_id: cid,
          metadata: {
            shipping_addr,
            billing_addr,
            cartIds: JSON.stringify(cartIds),
            orders: orderMeta,
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
