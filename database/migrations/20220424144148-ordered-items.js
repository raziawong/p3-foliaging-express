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
  return db.createTable("ordered_items", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    quantity: { type: "smallint", notNull: true },
    price: { type: "bigint", notNull: true },
    discounted_price: { type: "bigint", notNull: false },
    order_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_ordered_items_products_orders_order_id",
        table: "orders",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    product_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_ordered_items_products_users_product_id",
        table: "products",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
  });
};

exports.down = function (db) {
  const foreignKeys = [
    "FK_ordered_items_products_orders_order_id",
    "FK_ordered_items_products_users_product_id",
  ];
  const promises = foreignKeys.map((fk) =>
    db.removeForeignKey("ordered_items", fk)
  );
  let ret = null;
  try {
    ret = Promise.allSettled(promises).then(() => {
      db.dropTable("ordered_items");
    });
  } catch (err) {
    console.log("Encountered error when dropping <ordered_items> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
