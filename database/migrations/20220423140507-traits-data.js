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
  const attributes = [
    "Air Purifying",
    "Low-light Tolerant",
    "Drought Tolerant",
    "Mild Toxicity",
    "Skin Irritation with Sap",
    "Pet Friendly",
    "Variegated",
  ];
  const promises = attributes.map((a) => db.insert("traits", ["trait"], [a]));
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM traits";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
