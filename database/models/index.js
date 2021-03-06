const dayjs = require("dayjs");
const bookshelf = require("../bookshelf");

const AccountType = bookshelf.model("AccountType", {
  tableName: "account_types",
  users: function () {
    return this.hasMany("User");
  },
});
const User = bookshelf.model("User", {
  tableName: "users",
  initialize: function () {
    this.on("creating", (model, attributes) => {
      attributes.created_date = new Date();
      attributes.modified_date = new Date();
    });
    this.on("updating", (model, attributes) => {
      attributes.modified_date = new Date();
    });
  },
  type: function () {
    return this.belongsTo("AccountType");
  },
});

const LightRequirement = bookshelf.model("LightRequirement", {
  tableName: "light_requirements",
  plants: function () {
    return this.hasMany("Plant");
  },
});
const WaterFrequency = bookshelf.model("WaterFrequency", {
  tableName: "water_frequencies",
  plants: function () {
    return this.hasMany("Plant");
  },
});
const CareLevel = bookshelf.model("CareLevel", {
  tableName: "care_levels",
  plants: function () {
    return this.hasMany("Plant");
  },
});
const Trait = bookshelf.model("Trait", {
  tableName: "traits",
  plants: function () {
    return this.belongsToMany("Plant");
  },
});
const Species = bookshelf.model("Species", {
  tableName: "species",
  plants: function () {
    return this.hasMany("Plant");
  },
});
const Plant = bookshelf.model("Plant", {
  tableName: "plants",
  light: function () {
    return this.belongsTo("LightRequirement");
  },
  water: function () {
    return this.belongsTo("WaterFrequency");
  },
  care: function () {
    return this.belongsTo("CareLevel");
  },
  traits: function () {
    return this.belongsToMany("Trait");
  },
  species: function () {
    return this.belongsTo("Species");
  },
  products: function () {
    return this.hasMany("Product");
  },
});

const SupplyType = bookshelf.model("SupplyType", {
  tableName: "supply_types",
  supplies: function () {
    return this.hasMany("Supply", "type_id");
  },
});
const Supply = bookshelf.model("Supply", {
  tableName: "supplies",
  type: function () {
    return this.belongsTo("SupplyType", "type_id");
  },
  products: function () {
    return this.hasMany("Product");
  },
});

const PlanterType = bookshelf.model("PlanterType", {
  tableName: "planter_types",
  planters: function () {
    return this.hasMany("Planter", "type_id");
  },
});
const PlanterMaterial = bookshelf.model("PlanterMaterial", {
  tableName: "planter_materials",
  planters: function () {
    return this.hasMany("Planter", "material_id");
  },
});
const Planter = bookshelf.model("Planter", {
  tableName: "planters",
  type: function () {
    return this.belongsTo("PlanterType", "type_id");
  },
  material: function () {
    return this.belongsTo("PlanterMaterial", "material_id");
  },
  products: function () {
    return this.hasMany("Product");
  },
});

const Color = bookshelf.model("Color", {
  tableName: "colors",
  product: function () {
    return this.belongsTo("Product");
  },
});
const Size = bookshelf.model("Size", {
  tableName: "sizes",
  product: function () {
    return this.belongsTo("Product");
  },
});
const Discount = bookshelf.model("Discount", {
  tableName: "discounts",
  initialize: function () {
    this.on("creating", (model, attributes) => {
      attributes.created_date = new Date();
    });
  },
  products: function () {
    return this.belongsToMany("Product");
  },
});
const Product = bookshelf.model("Product", {
  tableName: "products",
  initialize: function () {
    this.on("creating", (model, attributes) => {
      attributes.created_date = new Date();
      attributes.modified_date = new Date();
    });
    this.on("updating", (model, attributes) => {
      attributes.modified_date = new Date();
    });
  },
  color: function () {
    return this.belongsTo("Color");
  },
  size: function () {
    return this.belongsTo("Size");
  },
  discounts: function () {
    return this.belongsToMany("Discount");
  },
  plant: function () {
    return this.belongsTo("Plant");
  },
  planter: function () {
    return this.belongsTo("Planter");
  },
  supply: function () {
    return this.belongsTo("Supply");
  },
  parse: function (resp) {
    if (resp.height) {
      resp.height = resp.height / 10;
    }
    if (resp.width) {
      resp.width = resp.width / 10;
    }
    if (resp.weight) {
      resp.weight = resp.weight / 1000;
    }
    if (resp.price) {
      resp.price = resp.price / 100;
    }
    return resp;
  },
  format: function (attributes) {
    Object.entries(attributes).map(([k, v]) => {
      if (!v) {
        delete attributes[k];
      }
    });

    if (attributes.height && !isNaN(attributes.height)) {
      attributes.height = attributes.height * 10;
    }
    if (attributes.width && !isNaN(attributes.width)) {
      attributes.width = attributes.width * 10;
    }
    if (attributes.weight && !isNaN(attributes.weight)) {
      attributes.weight = attributes.weight * 1000;
    }
    if (attributes.price && !isNaN(attributes.price)) {
      attributes.price = attributes.price * 100;
    }
    return attributes;
  },
});

const AddressType = bookshelf.model("AddressType", {
  tableName: "address_types",
  addresses: function () {
    return this.hasMany("Address");
  },
});
const Address = bookshelf.model("Address", {
  tableName: "addresses",
  type: function () {
    return this.belongsTo("AddressType");
  },
  customer: function () {
    return this.belongsTo("Customer");
  },
  orders: function () {
    return this.hasMany("Order");
  },
});
const Customer = bookshelf.model("Customer", {
  initialize: function () {
    this.on("creating", (model, attributes) => {
      attributes.created_date = new Date();
      attributes.modified_date = new Date();
    });
    this.on("updating", (model, attributes) => {
      attributes.modified_date = new Date();
    });
  },
  tableName: "customers",
  addresses: function () {
    return this.hasMany("Address");
  },
  cartItems: function () {
    return this.hasMany("CartItem");
  },
  orders: function () {
    return this.hasMany("Order");
  },
});

const BacklogAddress = bookshelf.model("BacklogAddress", {
  tableName: "backlog_addresses",
  orders: function () {
    return this.hasMany("Order");
  },
  payments: function () {
    return this.hasMany("PaymentDetail");
  },
});
const ShippingType = bookshelf.model("ShippingType", {
  tableName: "shipping_types",
  orders: function () {
    return this.hasMany("Order");
  },
  parse: function (resp) {
    if (resp.price) {
      resp.price = resp.price / 100;
    }
    return resp;
  },
});
const OrderStatus = bookshelf.model("OrderStatus", {
  tableName: "order_statuses",
  orders: function () {
    return this.hasMany("Order");
  },
});
const PaymentDetail = bookshelf.model("PaymentDetail", {
  tableName: "payment_details",
  order: function () {
    return this.belongsTo("Order");
  },
  billing_address: function () {
    return this.belongsTo("BacklogAddress");
  },
  parse: function (resp) {
    if (resp.amount) {
      resp.amount = resp.amount / 100;
    }
    return resp;
  },
  format: function (attributes) {
    if (attributes.amount && !isNaN(attributes.amount)) {
      attributes.amount = attributes.amount * 100;
    }
    return attributes;
  },
});
const Order = bookshelf.model("Order", {
  tableName: "orders",
  initialize: function () {
    this.on("creating", (model, attributes) => {
      attributes.ordered_date = new Date();
      attributes.updated_date = new Date();
    });
    this.on("updating", (model, attributes) => {
      attributes.updated_date = new Date();
    });
  },
  status: function () {
    return this.belongsTo("OrderStatus", "status_id");
  },
  customer: function () {
    return this.belongsTo("Customer");
  },
  shipping_type: function () {
    return this.belongsTo("ShippingType");
  },
  shipping_address: function () {
    return this.belongsTo("BacklogAddress", "address_id");
  },
  items: function () {
    return this.hasMany("OrderedItem");
  },
  payments: function () {
    return this.hasMany("PaymentDetail");
  },
  parse: function (resp) {
    if (resp.total_amount) {
      resp.total_amount = resp.total_amount / 100;
    }
    return resp;
  },
  format: function (attributes) {
    if (attributes.total_amount && !isNaN(attributes.total_amount)) {
      attributes.total_amount = attributes.total_amount * 100;
    }
    return attributes;
  },
});

const OrderedItem = bookshelf.model("OrderedItem", {
  tableName: "ordered_items",
  order: function () {
    return this.belongsTo("Order");
  },
  product: function () {
    return this.belongsTo("Product");
  },
  parse: function (resp) {
    if (resp.price) {
      resp.price = resp.price / 100;
    }
    if (resp.discounted_price) {
      resp.discounted_price = resp.discounted_price / 100;
    }
    return resp;
  },
  format: function (attributes) {
    if (attributes.price && !isNaN(attributes.price)) {
      attributes.price = attributes.price * 100;
    }
    if (attributes.discounted_price && !isNaN(attributes.discounted_price)) {
      attributes.discounted_price = attributes.discounted_price * 100;
    }
    return attributes;
  },
});

const CartItem = bookshelf.model("CartItem", {
  tableName: "cart_items",
  product: function () {
    return this.belongsTo("Product");
  },
  customer: function () {
    return this.belongsTo("Customer");
  },
});

const BlacklistedToken = bookshelf.model("BlacklistedToken", {
  tableName: "blacklisted_tokens",
  initialize: function () {
    this.on("creating", (model, attributes) => {
      attributes.created_date = new Date();
    });
  },
});

module.exports = {
  User,
  AccountType,
  LightRequirement,
  WaterFrequency,
  CareLevel,
  Trait,
  Species,
  Plant,
  SupplyType,
  Supply,
  PlanterType,
  PlanterMaterial,
  Planter,
  Color,
  Size,
  Discount,
  Product,
  AddressType,
  Address,
  Customer,
  BacklogAddress,
  ShippingType,
  OrderStatus,
  PaymentDetail,
  Order,
  OrderedItem,
  CartItem,
  BlacklistedToken,
};
