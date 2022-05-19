const {
  addAddressForCustomer,
  getAddressById,
  deleteAddress,
  updateAddress,
  getBacklogAddressByAddress,
  addBacklogAddress,
} = require("../access/addresses");
const { getCustomerById, updateCustomer } = require("../access/customers");
const {
  getAllOrdersByCustomerId,
  getOrderStatusForNewOrder,
  addOrderForCustomer,
} = require("../access/orders");
const {
  addOrderToPayment,
  getPaymentByCustomerEmail,
} = require("../access/payment-details");

const checkAndAddBacklogAddresses = async (address) => {
  let id = null;
  if (address) {
    const existAddr = await getBacklogAddressByAddress(address);
    if (existAddr) {
      id = existAddr.get("id");
    } else {
      const { line_1, line_2, floor_number, unit_number, postal_code } =
        address;
      const addr = await addBacklogAddress({
        line_1,
        line_2,
        floor_number,
        unit_number,
        postal_code,
      });
      if (addr) {
        id = addr.get("id");
      }
    }
  }
  return id;
};

class CustomerServices {
  constructor(cid) {
    this.cid = cid;
  }

  async getCustomer() {
    const customer = await getCustomerById(this.cid);
    return customer.unset("password");
  }

  async updateAccount(data) {
    const customer = await this.getCustomer();
    if (customer) {
      await updateCustomer(customer, data);
      return await this.getCustomer();
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
    if (await this.hasAddress(aid)) {
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
    if (await this.hasAddress(aid)) {
      await updateAddress(aid, data);
      return await this.getCustomer();
    }
    return false;
  }

  async removeAddress(aid) {
    if (await this.hasAddress(aid)) {
      const address = await getAddressById(aid);

      if (address) {
        await deleteAddress(aid);
        return await this.getCustomer();
      }
      return false;
    }
    return false;
  }

  async getOrders() {
    return await getAllOrdersByCustomerId(this.cid);
  }

  async insertOrderAndPayment(data) {
    const {
      shipping_type_id,
      shipping_address,
      billing_address,
      payment_intent_id,
      ...inputs
    } = data;

    if (inputs) {
      const newOrderStatus = await getOrderStatusForNewOrder();
      const customer = await this.getCustomer();

      if (newOrderStatus) {
        const shipping_addr_id = await checkAndAddBacklogAddresses(
          shipping_address
        );
        const billing_addr_id = await checkAndAddBacklogAddresses(
          billing_address
        );

        let orderObj = {
          customer_id: customer.get("id"),
          status_id: newOrderStatus.get("id"),
          address_id: shipping_addr_id,
          ...inputs,
        };

        if (shipping_type_id) {
          orderObj.shipping_type_id = shipping_type_id;
        }

        console.log("Attempt to insert Order ------", orderObj);
        const order = await addOrderForCustomer(orderObj);
        console.log("Results from inserting Order ------", order);

        const payment = await getPaymentByCustomerEmail(
          customer.get("email"),
          payment_intent_id
        );

        if (payment && order) {
          console.log("Attempt to update Payment ------", payment.get("id"), {
            order_id: order.get("id"),
            address_id: billing_addr_id,
          });
          const updated = await addOrderToPayment(payment, {
            order_id: order.get("id"),
            address_id: billing_addr_id,
          });
          console.log("Results from updating Payment ------", updated);
        }

        return order;
      }

      return false;
    }
    return false;
  }
}

module.exports = CustomerServices;
