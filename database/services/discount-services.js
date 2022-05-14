const compareCreatedDate = (a, b) =>
  new Date(b.created_date).getTime() - new Date(a.created_date).getTime();

class DiscountServices {
  constructor(pid, discounts) {
    this.pid = pid;
    this.discounts = discounts;
  }

  async getAutoDiscount() {
    let discount = 0;
    const now = new Date();
    if (this.discounts) {
      const autoArr = this.discounts
        .filter((item) => !item.code)
        .sort(compareCreatedDate);

      for (const item of autoArr) {
        const start = new Date(item.start_date);
        const end = new Date(item.end_date);
        if (now.getTime() >= start.getTime() && end.getTime() > now.getTime()) {
          discount = item.percentage;
          break;
        }
      }
    }

    return discount;
  }

  async getCouponDiscount(coupon) {
    let discount = 0;
    const now = new Date();
    if (this.discounts) {
      const autoArr = this.discounts.filter((item) => item.code === coupon);

      for (const item of autoArr) {
        const start = new Date(item.start_date);
        const end = new Date(item.end_date);
        if (now.getTime() >= start.getTime() && end.getTime() > now.getTime()) {
          discount = item.percentage;
          break;
        }
      }
    }

    return discount;
  }
}

module.exports = DiscountServices;
