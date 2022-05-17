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
  const levels = ["Easy", "Medium", "Hard"];
  const promises = levels.map((l) => db.insert("care_levels", ["level"], [l]));
  return Promise.allSettled(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM care_levels";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
