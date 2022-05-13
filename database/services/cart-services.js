const {
  getCartItemByCustomerAndProduct,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  getShoppingCart,
} = require("../access/cart-items");
const ImageServices = require("./image-services");

class CartServices {
  constructor(cid) {
    this.cid = cid;
  }

  async getCart() {
    const cart = await getShoppingCart(this.cid);
    if (cart) {
      let resp = cart.toJSON();
      for (const item of resp) {
        if (item.product.uploadcare_group_id) {
          item.images = await new ImageServices(
            item.product.id
          ).getImagesUrls();
        }
      }

      return resp;
    }
    return {};
  }

  async addItemToCart(pid, quantity) {
    const cartItem = await getCartItemByCustomerAndProduct(this.cid, pid);
    let resp = {};

    if (cartItem) {
      resp = await updateCartItemQuantity(
        this.cid,
        pid,
        cartItem.get("quantity") + 1
      );
    } else {
      resp = await addCartItem(this.cid, pid, quantity);
    }

    if (resp) {
      resp = resp.toJSON();
      if (resp.product.uploadcare_group_id) {
        resp.images = await new ImageServices(resp.product.id).getImagesUrls();
      }
    }

    return resp;
  }

  async removeItemFromCart(pid) {
    return await deleteCartItem(this.cid, pid);
  }

  async setItemQuantity(pid, quantity) {
    const cartItem = await updateCartItemQuantity(this.cid, pid, quantity);
    let resp = {};

    if (cartItem) {
      resp = cartItem.toJSON();
      if (resp.product.uploadcare_group_id) {
        resp.images = await new ImageServices(resp.product.id).getImagesUrls();
      }
    }

    return resp;
  }
}

module.exports = CartServices;
