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

const addOrderToPayment = async (payment, oid) => {
  try {
    if (payment && oid) {
      payment.set({ order_id: oid });
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
