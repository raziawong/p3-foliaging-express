const { CartItem } = require("../models");

const getShoppingCart = async (customerId) => {
  try {
    return await CartItem.where({
      customer_id: customerId,
    }).fetchAll({
      require: false,
      withRelated: ["product", "customer"],
    });
  } catch (err) {
    console.error(err);
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
      withRelated: ["product", "customer"],
    });
  } catch (err) {
    console.error(err);
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
    return cartItem.fetch({
      withRelated: ["product", "customer"],
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const deleteCartItem = async (customerId, productId) => {
  try {
    const cartItem = await getCartItemByCustomerAndProduct(
      customerId,
      productId
    );
    if (cartItem) {
      return await cartItem.destroy();
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const updateCartItemQuantity = async (customerId, productId, newQuantity) => {
  try {
    const cartItem = await getCartItemByCustomerAndProduct(
      customerId,
      productId
    );
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

module.exports = {
  getShoppingCart,
  getCartItemByCustomerAndProduct,
  addCartItem,
  deleteCartItem,
  updateCartItemQuantity,
};
