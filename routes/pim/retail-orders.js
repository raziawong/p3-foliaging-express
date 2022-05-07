const router = require("express").Router();
const {
  getAllOrders,
  getOrderById,
  updateOrder,
} = require("../../database/access/orders");
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const { updateOrderForm, uiFields } = require("../../helpers/form-operations");

router.get("/", async (req, res, next) => {
  const items = await getAllOrders();

  if (items) {
    res.render("listing/orders", {
      orders: items.toJSON(),
    });
  } else {
    fetchErrorHandler(next, "orders");
  }
});

router.get("/:id/update", async (req, res, next) => {
  const order = await getOrderById(req.params.id);

  if (order) {
    const orderForm = updateOrderForm().bind({ ...order.attributes });
    const customer = order.related("customer");

    res.render("operations/update", {
      title: `Order ${order.get("id")} for ${customer.get(
        "first_name"
      )} ${customer.get("last_name")}`,
      form: orderForm.toHTML(uiFields),
    });
  } else {
    fetchErrorHandler(next, "order", req.params.id);
  }
});

router.post("/:id/update", async (req, res, next) => {
  const order = await getOrderById(req.params.id);

  if (order) {
    const orderForm = updateOrderForm();
    orderForm.handle(req, {
      success: async (form) => {
        const updatedOrder = await updateOrder(order, form.data);
        req.flash(
          variables.success,
          messages.updateSuccess(titles.order, updatedOrder.get("id"))
        );
        req.session.save(() => {
          res.redirect("/retail/orders");
        });
      },
      error: async (form) => {
        const customer = order.related("customer");

        res.render("operations/update", {
          title: `Order ${order.get("id")} for ${customer.get(
            "first_name"
          )} ${customer.get("last_name")}`,
          form: form.toHTML(uiFields),
        });
      },
    });
  } else {
    fetchErrorHandler(next, "order", req.params.id);
  }
});

module.exports = router;
