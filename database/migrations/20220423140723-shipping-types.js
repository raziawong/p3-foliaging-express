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
  return db.createTable("shipping_types", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    name: { type: "string", length: 50, unique: true, notNull: true },
    min_day: { type: "smallint", notNull: true },
    max_day: { type: "smallint", notNull: true },
    price: { type: "bigint", notNull: true },
    min_cart_amount: { type: "bigint", notNull: true },
    max_cart_amount: { type: "bigint", notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("shipping_types");
};

exports._meta = {
  version: 1,
};
