const router = require("express").Router();
const {
  getAllOrders,
  getOrderById,
  updateOrder,
  getAllOrderStatusesOpts,
  searchOrders,
} = require("../../database/access/orders");
const { getAllProductsOpts } = require("../../database/access/products");
const {
  messages,
  titles,
  variables,
  fetchErrorHandler,
} = require("../../helpers/const");
const {
  searchOrderForm,
  updateOrderForm,
  uiFields,
} = require("../../helpers/form-operations");

router.get("/", async (req, res, next) => {
  const showAllOrders = async (form) => {
    const items = await getAllOrders();

    if (items) {
      res.render("listing/orders", {
        form: form.toHTML(uiFields),
        orders: items.toJSON(),
      });
    } else {
      fetchErrorHandler(next, "orders");
    }
  };
  const showQueriedOrders = async (form) => {
    const queries = req.query;
    const builder = (qb) => {
      if (queries.customer) {
        qb.join("customers", "orders.customer_id", "customers.id")
          .where("username", process.env.LIKE_SYNTAX, "%" + queries.title + "%")
          .orWhere(
            "first_name",
            process.env.LIKE_SYNTAX,
            "%" + queries.customer + "%"
          )
          .orWhere(
            "last_name",
            process.env.LIKE_SYNTAX,
            "%" + queries.customer + "%"
          )
          .orWhere(
            "email",
            process.env.LIKE_SYNTAX,
            "%" + queries.customer + "%"
          );
      }

      if (queries.from_ordered_date) {
        qb.where("ordered_date", ">=", queries.from_ordered_date);
      }
      if (queries.to_ordered_date) {
        qb.where("ordered_date", "<=", queries.to_ordered_date);
      }

      if (queries.product_id) {
        qb.join("ordered_items", "orders.id", "order_id").where(
          "product_id",
          "=",
          queries.product_id
        );
      }

      if (queries.status_id) {
        qb.where("status_id", "=", queries.status_id);
      }
    };

    const items = await searchOrders(builder);

    if (items) {
      res.render("listing/orders", {
        form: form.toHTML(uiFields),
        orders: items.toJSON(),
      });
    } else {
      fetchErrorHandler(next, "orders");
    }
  };

  const statusOpts = await getAllOrderStatusesOpts();
  statusOpts.unshift(["", "None"]);
  const searchForm = searchOrderForm(await getAllProductsOpts(), statusOpts);

  searchForm.handle(req, {
    empty: (form) => {
      showAllOrders(form);
    },
    success: (form) => {
      showQueriedOrders(form);
    },
    error: (form) => {
      showAllOrders(form);
    },
  });
});

router.get("/:id/update", async (req, res, next) => {
  const order = await getOrderById(req.params.id);

  if (order) {
    const orderForm = updateOrderForm(await getAllOrderStatusesOpts()).bind({
      ...order.attributes,
    });
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
        const { status_id, delivery_tracking, remarks } = form.data;
        const updatedOrder = await updateOrder(order, {
          status_id,
          delivery_tracking,
          remarks,
        });
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
