const { CartItem } = require("../models");

const getShoppingCart = async (cid) => {
  try {
    return await CartItem.where({
      customer_id: cid,
    }).fetchAll({
      require: false,
      withRelated: ["product"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getCartItemByCustomerAndProduct = async (cid, pid) => {
  try {
    return await CartItem.where({
      customer_id: cid,
      product_id: pid,
    }).fetch({
      require: false,
      withRelated: ["product"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addCartItem = async (cid, pid, quantity) => {
  try {
    const cartItem = new CartItem({
      customer_id: cid,
      product_id: pid,
      quantity: quantity,
    });
    await cartItem.save();
    return cartItem.fetch({
      withRelated: ["product"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const deleteCartItemByCustomer = async (cid, pid) => {
  try {
    const cartItem = await getCartItemByCustomerAndProduct(cid, pid);
    if (cartItem) {
      return await cartItem.destroy();
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateCartItemQuantity = async (cid, pid, newQuantity) => {
  try {
    const cartItem = await getCartItemByCustomerAndProduct(cid, pid);
    if (cartItem) {
      cartItem.set("quantity", newQuantity);
      cartItem.save();
      return cartItem;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getCartItemById = async (id) => {
  try {
    return await CartItem.where({ id }).fetch({
      require: false,
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const deleteCartItemById = async (id) => {
  try {
    const cartItem = await getCartItemById(id);
    if (cartItem) {
      return await cartItem.destroy();
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  getShoppingCart,
  getCartItemByCustomerAndProduct,
  addCartItem,
  deleteCartItemByCustomer,
  updateCartItemQuantity,
  getCartItemById,
  deleteCartItemById,
};
