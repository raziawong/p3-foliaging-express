const {
  getCartItemByCustomerAndProduct,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItemByCustomer,
  getShoppingCart,
} = require("../access/cart-items");
const { getProductById } = require("../access/products");
const ProductServices = require("./product-services");

class CartServices {
  constructor(cid) {
    this.cid = cid;
  }

  async getCart() {
    const cart = await getShoppingCart(this.cid);
    if (cart) {
      let resp = cart.toJSON();
      for (let item of resp) {
        if (item.product.uploadcare_group_id) {
          item.images = await new ProductServices(
            item.product.id
          ).getImagesUrls();
        }

        const check = await this.verifyStockQuantity(
          item.product_id,
          item.quantity
        );

        item.isEnough = check.isEnough;
      }

      return resp;
    }
    return {};
  }

  async addItemToCart(pid, quantity = 1) {
    const cartItem = await getCartItemByCustomerAndProduct(this.cid, pid);
    let resp = {};

    quantity = cartItem ? quantity + 1 : quantity;
    const check = await this.verifyStockQuantity(pid, quantity);

    if (cartItem) {
      resp = await updateCartItemQuantity(this.cid, pid, check.quantity);
    } else {
      resp = await addCartItem(this.cid, pid, check.quantity);
    }

    if (resp) {
      resp = resp.toJSON();
      if (resp.product.uploadcare_group_id) {
        resp.images = await new ProductServices(
          resp.product.id
        ).getImagesUrls();
      }
    }

    return { ...resp, ...check };
  }

  async removeItemFromCart(pid) {
    return await deleteCartItemByCustomer(this.cid, pid);
  }

  async setItemQuantity(pid, quantity) {
    const check = await this.verifyStockQuantity(pid, quantity);
    const cartItem = await updateCartItemQuantity(
      this.cid,
      pid,
      check.quantity
    );

    let resp = {};

    if (cartItem) {
      resp = cartItem.toJSON();
      if (resp.product.uploadcare_group_id) {
        resp.images = await new ProductServices(
          resp.product.id
        ).getImagesUrls();
      }
    }

    return { ...resp, ...check };
  }

  async verifyStockQuantity(pid, quantity = 1) {
    const product = await getProductById(pid);
    const stock = product.get("stock");
    const isEnoughStock = quantity <= stock;

    return isEnoughStock
      ? { isEnough: quantity < stock, quantity }
      : { isEnough: false, quantity: stock };
  }
}

module.exports = CartServices;
