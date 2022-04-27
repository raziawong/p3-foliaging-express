const bookshelf = require("../bookshelf");

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
const Image = bookshelf.model("Image", {
  tableName: "images",
  product: function () {
    return this.belongsTo("Product");
  },
});
const Discount = bookshelf.model("Discount", {
  tableName: "discounts",
  products: function () {
    return this.belongsToMany("Product");
  },
});
const Product = bookshelf.model("Product", {
  tableName: "products",
  color: function () {
    return this.belongsTo("Color");
  },
  size: function () {
    return this.belongsTo("Size");
  },
  images: function () {
    return this.hasMany("Image");
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

const AccountType = bookshelf.model("AccountType", {
  tableName: "account_types",
  users: function () {
    return this.hasMany("User");
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
  user: function () {
    return this.belongsTo("User");
  },
});
const User = bookshelf.model("User", {
  tableName: "users",
  type: function () {
    return this.belongsTo("AccountType");
  },
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
});
const Order = bookshelf.model("Order", {
  tableName: "orders",
  status: function () {
    return this.belongsTo("OrderStatus");
  },
  customer: function () {
    return this.belongsTo("User");
  },
  items: function () {
    return this.hasMany("OrderedItem");
  },
  payments: function () {
    return this.hasMany("PaymentDetail");
  },
});

const OrderedItem = bookshelf.model("OrderedItem", {
  tableName: "ordered_items",
  order: function () {
    return this.belongsTo("Order");
  },
  user: function () {
    return this.belongsTo("User");
  },
});

const CartItem = bookshelf.model("CartItem", {
  tableName: "cart_items",
  product: function () {
    return this.belongsTo("Product");
  },
  user: function () {
    return this.belongsTo("User");
  },
});

module.exports = {
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
  Image,
  Discount,
  Product,
  AccountType,
  AddressType,
  Address,
  User,
  OrderStatus,
  PaymentDetail,
  Order,
  OrderedItem,
  CartItem,
};
