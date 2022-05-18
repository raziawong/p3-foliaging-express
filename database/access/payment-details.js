const { PaymentDetail } = require("../models");

const getPaymentByCustomerEmail = async (email) => {
  try {
    return await PaymentDetail.where({ customer_email: email }).fetch({
      require: true,
    });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addPaymentDetail = async (data) => {
  try {
    const payment = new PaymentDetail().set(data);
    await payment.save();
    return payment;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addOrderToPayment = async (payment, {order_id, address_id}) => {
  try {
    if (payment && data) {
      payment.set({ order_id, address_id });
      return await payment.save();
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  getPaymentByCustomerEmail,
  addPaymentDetail,
  addOrderToPayment,
};
