const { Order, OrderedItem, OrderStatus } = require("../models");

const getOrderById = async (oid) => {
  try {
    return await Order.where({ id: oid }).fetch({
      require: true,
    });
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

module.exports = {
  getOrderById,
  getAllOrdersByCustomerId,
  addOrderForCustomer,
  getOrderStatusForNewOrder,
  updateOrderStatus,
};
