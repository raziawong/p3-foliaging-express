const {
  addAddressForCustomer,
  getAddressById,
  archiveAddress,
  deleteAddress,
  updateAddress,
} = require("../access/addresses");
const { getCustomerById, updateCustomer } = require("../access/customers");

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
    const addresses = customer.related("address");

    if (addresses && addresses.pluck("id").includes(aid)) {
      return true;
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
}

module.exports = CustomerServices;
