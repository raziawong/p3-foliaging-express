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
  const colors = [
    "Mixed",
    "Red",
    "Deep Green",
    "Bright Green",
    "Green",
    "Orange",
    "Blue",
    "Yellow",
    "Purple",
    "Beige",
    "White",
    "Off-White",
    "Grey",
    "Black",
    "Gold",
    "Silver",
  ];
  const promises = colors.map((c) => db.insert("colors", ["color"], [c]));
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM colors";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
