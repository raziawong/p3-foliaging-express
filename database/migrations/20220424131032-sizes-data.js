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
  const sizes = ["Small", "Medium", "Large"];
  const promises = sizes.map((s) => db.insert("sizes", ["size"], [s]));
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM sizes";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
