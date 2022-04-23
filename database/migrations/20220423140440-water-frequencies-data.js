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
  const frequencies = ["Twice a week", "Once a week", "Once every forthnight"];
  const promises = frequencies.map((f) =>
    db.insert("water_frequencies", ["frequency"], [f])
  );
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM water_frequencies";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
