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
  const requirements = [
    "Full Sun",
    "Partial Sun",
    "Bright Indirect Light",
    "Medium Indirect Light",
    "Moderate Indirect Light",
  ];
  const promises = requirements.map((r) =>
    db.insert("light_requirements", ["requirement"], [r])
  );
  return Promise.allSettled(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM light_requirements";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
