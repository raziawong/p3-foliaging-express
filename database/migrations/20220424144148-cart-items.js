"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("cart_items", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    quantity: { type: "smallint", notNull: true },
    product_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_cart_items_products_customers_product_id",
        table: "products",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    customer_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_cart_items_products_customers_user_id",
        table: "customers",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
  });
};

exports.down = function (db) {
  const foreignKeys = [
    "FK_cart_items_products_customers_product_id",
    "FK_cart_items_products_customers_user_id",
  ];
  const promises = foreignKeys.map((fk) =>
    db.removeForeignKey("cart_items", fk)
  );
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("cart_items");
    });
  } catch (err) {
    console.log("Encountered error when dropping <cart_items> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
