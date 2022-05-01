const {
  getCartItemByCustomerAndProduct,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  getShoppingCart,
} = require("../access/cart-items");

class CartServices {
  constructor(customerId) {
    this.customerId = customerId;
  }

  async getCart() {
    return await getShoppingCart(this.customerId);
  }

  async addItemToCart(productId, quantity) {
    const cartItem = await getCartItemByCustomerAndProduct(
      this.customerId,
      productId
    );
    if (cartItem) {
      return await updateCartItemQuantity(
        this.customerId,
        productId,
        cartItem.get("quantity") + 1
      );
    } else {
      return await addCartItem(this.customerId, productId, quantity);
    }
  }

  async removeItemFromCart(productId) {
    return await deleteCartItem(this.customerId, productId);
  }

  async setItemQuantity(productId, quantity) {
    return await updateCartItemQuantity(this.customerId, productId, quantity);
  }
}

module.exports = CartServices;
