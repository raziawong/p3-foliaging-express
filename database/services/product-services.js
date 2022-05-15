const axios = require("axios");
const { compareCreatedDate } = require("../../helpers/const");
const { getProductById } = require("../access/products");

class ProductServices {
  constructor(pid, discounts = null) {
    this.pid = pid;
    this.discounts = discounts;
  }

  async getProduct() {
    const product = await getProductById(this.pid);
    if (product && product.discounts) {
      this.discounts = product.discounts;
    }
    return product;
  }

  getDeals() {
    let discounts = [];
    const now = new Date();
    if (this.discounts) {
      const dealArr = this.discounts.filter((item) => !item.code);

      for (const item of dealArr) {
        const start = new Date(item.start_date);
        const end = new Date(item.end_date);
        if (now.getTime() >= start.getTime() && end.getTime() > now.getTime()) {
          discount.push(item);
        }
      }
    }

    return discounts.sort(compareCreatedDate);
  }

  getLatestDeal() {
    const discounts = this.getDeals();
    return discounts.length ? discounts[0] : 0;
  }

  getCoupons() {
    let discounts = [];
    const now = new Date();
    if (this.discounts) {
      const couponArr = this.discounts.filter((item) => item.code);

      for (const item of couponArr) {
        const start = new Date(item.start_date);
        const end = new Date(item.end_date);
        if (now.getTime() >= start.getTime() && end.getTime() > now.getTime()) {
          discount.push(item);
        }
      }
    }

    return discounts.sort(compareCreatedDate);
  }

  getCouponDiscount(coupon) {
    const discounts = this.getCoupons();

    return discounts.length
      ? discounts.filter((item) => item.code === coupon)
      : 0;
  }

  async getImagesGroupInfo() {
    const product = await getProductById(this.pid);
    if (product) {
      const imageGroupId = product.get("uploadcare_group_id");
      try {
        const groupInfo = await axios.get(
          `https://api.uploadcare.com/groups/${imageGroupId}/`,
          {
            headers: {
              Accept: "application/vnd.uploadcare-v0.5+json",
              Authorization:
                "Uploadcare.Simple " +
                process.env.UPLOADCARE_PUBLIC_KEY +
                ":" +
                process.env.UPLOADCARE_SECRET_KEY,
            },
          }
        );
        return groupInfo.data;
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }

  async getImagesUrls() {
    try {
      const groupInfo = await this.getImagesGroupInfo();
      const { files } = groupInfo;
      let urls = false;

      if (files && files.length) {
        urls = files.map((file) => file["original_file_url"]);
      }

      return urls;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = ProductServices;
