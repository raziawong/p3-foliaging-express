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
  return db.createTable("discounts_products", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    discount_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_discounts_products_discount_id",
        table: "discounts",
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
        name: "FK_discounts_products_product_id",
        table: "products",
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
    "FK_discounts_products_discount_id",
    "FK_discounts_products_product_id",
  ];
  const promises = foreignKeys.map((fk) =>
    db.removeForeignKey("discounts_products", fk)
  );
  let ret = null;
  try {
    ret = Promise.allSettled(promises).then(() => {
      db.dropTable("discounts_products");
    });
  } catch (err) {
    console.log("Encountered error when dropping <discounts_products> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
