const {
  addAddressForCustomer,
  getAddressById,
  archiveAddress,
  deleteAddress,
} = require("../access/addresses");
const {
  getCustomerById,
  addCustomer,
  updateCustomer,
} = require("../access/customers");

class CustomerServices {
  constructor(cid) {
    this.cid = cid;
  }

  async getCustomer() {
    return await getCustomerById(this.cid);
  }

  async createAccount(data) {
    return await addCustomer(data);
  }

  async updateAccount(cid, data) {
    const customer = await getCustomerById(cid);
    if (customer) {
      return await updateCustomer(customer, data);
    }
    return false;
  }

  async addAddress(cid, data) {
    const customer = await getCustomerById(cid);
    if (customer) {
      return await addAddressForCustomer(cid, data);
    }
    return false;
  }

  async removeAddress(aid) {
    const address = await getAddressById(aid);

    if (address) {
      if (address.related("orders")) {
        return await archiveAddress(address);
      } else {
        return await deleteAddress(aid);
      }
    }
    return false;
  }
}

module.exports = CustomerServices;
