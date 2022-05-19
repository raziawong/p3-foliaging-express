const { Order, OrderedItem, OrderStatus, ShippingType } = require("../models");

const getAllOrders = async () => {
  try {
    return await Order.fetchAll({
      require: false,
      withRelated: [
        "status",
        "customer",
        "shipping_type",
        "shipping_address",
        "items.product",
        "payments",
      ],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getOrderById = async (oid) => {
  try {
    return await Order.where({ id: oid }).fetch({
      require: true,
      withRelated: [
        "status",
        "customer",
        "shipping_type",
        "shipping_address",
        "items.product",
        "payments",
      ],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateOrder = async (order, data) => {
  try {
    if (order) {
      order.set(data);
      await order.save();
    }
    return order;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllOrdersByCustomerId = async (cid) => {
  try {
    return await Order.where({ customer_id: cid }).fetch({
      require: true,
      withRelated: ["status", "address", "items", "payments"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addOrderForCustomer = async (data) => {
  try {
    const { items, ...inputs } = data;
    const order = new Order().set(inputs);
    await order.save();

    for (const item of items) {
      const orderedItem = new OrderedItem().set({
        order_id: order.get("id"),
        ...item,
      });
      await orderedItem.save();
    }

    return order;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getOrderStatusForNewOrder = async () => {
  try {
    return await OrderStatus.query((qb) => {
      qb.orderBy("id");
      qb.limit(1);
    }).fetch({ require: true });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateOrderStatus = async (order, sid) => {
  try {
    if (order) {
      order.set({ status_id: sid });
      await order.save();
    }
    return order;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllShippingTypes = async () => {
  try {
    return await ShippingType.fetchAll();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getShippingTypeById = async (id) => {
  try {
    return await ShippingType.where({ id }).fetch({
      require: true,
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getOrderedItemByProductId = async (pid) => {
  try {
    return await OrderedItem.where({ product_id: pid }).fetch({
      require: false,
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllOrderStatuses = async (sortCol = "id", sortOrder = "ASC") => {
  try {
    return await OrderStatus.collection().orderBy(sortCol, sortOrder).fetch();
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getAllOrderStatusesOpts = async () => {
  return await getAllOrderStatuses().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("status")])
  );
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrder,
  getAllOrdersByCustomerId,
  addOrderForCustomer,
  getOrderStatusForNewOrder,
  updateOrderStatus,
  getAllShippingTypes,
  getShippingTypeById,
  getOrderedItemByProductId,
  getAllOrderStatuses,
  getAllOrderStatusesOpts,
};
