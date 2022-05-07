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
  return db.createTable("orders", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    total_amount: { type: "bigint", notNull: true },
    ordered_date: { type: "datetime", notNull: true },
    updated_date: { type: "datetime", notNull: true },
    shipping_type_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_orders_shipping_types_shipping_type_id",
        table: "shipping_types",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    status_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_orders_addresses_shipping_address_id",
        table: "addresses",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    status_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_orders_order_statuses_status_id",
        table: "order_statuses",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    customer_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_orders_customers_customer_id",
        table: "customers",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    address_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_orders_addresses_address_id",
        table: "addresses",
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
    "FK_orders_shipping_types_shipping_type_id",
    "FK_orders_addresses_shipping_address_id",
    "FK_orders_order_statuses_status_id",
    "FK_orders_customers_customer_id",
    "FK_orders_addresses_address_id",
  ];
  const promises = foreignKeys.map((fk) => db.removeForeignKey("orders", fk));
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("orders");
    });
  } catch (err) {
    console.log("Encountered error when dropping <orders> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
