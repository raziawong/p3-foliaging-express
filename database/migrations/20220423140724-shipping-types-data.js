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
  const types = [
    ["Same Day Delivery", 1, 1, 2000, 0, 14999],
    ["Next Day Delivery", 5, 7, 700, 0, 14999],
    ["Free Delivery", 5, 7, 700, 15000, 1000000],
  ];
  const promises = types.map((t) =>
    db.insert(
      "shipping_types",
      [
        "name",
        "min_day",
        "max_day",
        "price",
        "min_cart_amount",
        "max_cart_amount",
      ],
      t
    )
  );
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM shipping_types";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
