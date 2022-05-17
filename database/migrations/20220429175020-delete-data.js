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
  return null;
};

exports.down = function (db) {
  const tables = [
    "discounts_products",
    "discounts",
    "products",
    "backlog_addresses",
    "payment_details",
    "orders",
    "ordered_items",
    "addresses",
    "cart_items",
    "customers",
    "users",
    "blacklisted_tokens",
  ];
  const promises = tables.map((name) => {
    const sql = `DELETE FROM ${name}`;
    return db.runSql(sql, function (err) {
      if (err) return console.log(err);
    });
  });
  return Promise.allSettled(promises);
};

exports._meta = {
  version: 1,
};
