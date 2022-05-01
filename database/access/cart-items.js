const { CartItem } = require("../models");

const getShoppingCart = async (customerId) => {
  try {
    return await CartItem.where({
      customer_id: customerId,
    }).fetchAll({
      require: false,
      withRelated: ["product", "customers"],
    });
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

const getCartItemByCustomerAndProduct = async (customerId, productId) => {
  try {
    return await CartItem.where({
      customer_id: customerId,
      product_id: productId,
    }).fetch({
      require: false,
      withRelated: ["product", "customers"],
    });
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

const addCartItem = async (customerId, productId, quantity) => {
  try {
    const cartItem = new CartItem({
      customer_id: customerId,
      product_id: productId,
      quantity: quantity,
    });
    await cartItem.save();
    return cartItem;
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

const deleteCartItem = async (customerId, productId) => {
  try {
    const cartItem = await getCartItemByUserAndProduct(customerId, productId);
    if (cartItem) {
      await cartItem.destroy();
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

const updateCartItemQuantity = async (customerId, productId, newQuantity) => {
  try {
    const cartItem = await getCartItemByUserAndProduct(customerId, productId);
    if (cartItem) {
      cartItem.set("quantity", newQuantity);
      cartItem.save();
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
  } finally {
    return false;
  }
};

module.exports = {
  getShoppingCart,
  getCartItemByCustomerAndProduct,
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,
};
