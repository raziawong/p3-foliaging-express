const {
  getCartItemByCustomerAndProduct,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  getShoppingCart,
} = require("../access/cart-items");

class CartServices {
  constructor(cid) {
    this.cid = cid;
  }

  async getCart() {
    return await getShoppingCart(this.cid);
  }

  async addItemToCart(pid, quantity) {
    const cartItem = await getCartItemByCustomerAndProduct(this.cid, pid);
    if (cartItem) {
      return await updateCartItemQuantity(
        this.cid,
        pid,
        cartItem.get("quantity") + 1
      );
    } else {
      return await addCartItem(this.cid, pid, quantity);
    }
  }

  async removeItemFromCart(pid) {
    return await deleteCartItem(this.cid, pid);
  }

  async setItemQuantity(pid, quantity) {
    return await updateCartItemQuantity(this.cid, pid, quantity);
  }
}

module.exports = CartServices;
