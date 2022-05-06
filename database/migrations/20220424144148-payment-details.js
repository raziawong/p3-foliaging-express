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
  return db.createTable("payment_details", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    payment_intent_id: { type: "string", length: 150, notNull: true },
    receipt_url: { type: "string", length: 2048, notNull: true },
    payment_status: { type: "string", length: 20, notNull: true },
    payment_method: { type: "string", length: 20, notNull: true },
    customer_email: { type: "string", length: 320, notNull: true },
    amount: { type: "bigint", notNull: true },
    order_id: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "FK_payment_details_orders_order_id",
        table: "orders",
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
  const foreignKeys = ["FK_payment_details_orders_order_id"];
  const promises = foreignKeys.map((fk) =>
    db.removeForeignKey("payment_details", fk)
  );
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("payment_details");
    });
  } catch (err) {
    console.log("Encountered error when dropping <payment_details> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
