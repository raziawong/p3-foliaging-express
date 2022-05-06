const {
  addAddressForCustomer,
  getAddressById,
  archiveAddress,
  deleteAddress,
  updateAddress,
} = require("../access/addresses");
const { getCustomerById, updateCustomer } = require("../access/customers");
const { getAllOrdersByCustomerId } = require("../access/orders");
const { addOrderToPayment } = require("../access/payment-details");

class CustomerServices {
  constructor(cid) {
    this.cid = cid;
  }

  async getCustomer() {
    return await getCustomerById(this.cid);
  }

  async updateAccount(data) {
    const customer = await this.getCustomer();
    if (customer) {
      const updated = await updateCustomer(customer, data);
      const { password, ...data } = updated.attributes;
      return data;
    }
    return false;
  }

  async hasAddress(aid) {
    const customer = await this.getCustomer();
    if (customer) {
      const addresses = customer.related("addresses");
      if (addresses && addresses.pluck("id").includes(aid)) {
        return true;
      }
    }
    return false;
  }

  async getAddresses() {
    const customer = await this.getCustomer();
    return customer.related("addresses");
  }

  async getAddress(aid) {
    if (await hasAddress(aid)) {
      return await getAddressById(aid);
    }
    return false;
  }

  async addAddress(data) {
    const customer = await this.getCustomer();
    if (customer) {
      await addAddressForCustomer(customer.get("id"), data);
      return await this.getCustomer();
    }
    return false;
  }

  async updateAddress(aid, data) {
    if (await hasAddress(aid)) {
      await updateAddress(data);
      return await this.getCustomer();
    }
    return false;
  }

  async removeAddress(aid) {
    if (await hasAddress(aid)) {
      const address = await getAddressById(aid);

      if (address) {
        if (address.related("orders")) {
          await archiveAddress(address);
          return await this.getCustomer();
        } else {
          await deleteAddress(aid);
          return await this.getCustomer();
        }
      }
      return false;
    }
    return false;
  }

  async getOrders() {
    return await getAllOrdersByCustomerId(this.cid);
  }

  async insertOrderAndPayment(data) {
    if (data && data.shipping_address_id) {
      const newOrderStatus = await getOrderStatusForNewOrder();
      const customer = await this.getCustomer();
      const hasAddress = await this.hasAddress(data.data.shipping_address_id);

      if (newOrderStatus && hasAddress) {
        const order = await addOrderForCustomer({
          customer_id: customer.get("id"),
          status_id: newOrderStatus.get("id"),
          ...data,
        });

        const payment = getPaymentByCustomerEmail(customer.get("email"));
        if (payment && order) {
          await addOrderToPayment(payment, order.get("id"));
        }

        return order;
      }

      return false;
    }
    return false;
  }
}

module.exports = CustomerServices;
