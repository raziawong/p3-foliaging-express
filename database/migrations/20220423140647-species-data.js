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
  const names = [
    "Monstera Deliciosa",
    "Monstera Adansonii",
    "Epipremnum Aureum",
    "Philodendron Hederaceum",
    "Begonia Rex",
    "Dracaena Trifasciata",
  ];
  const promises = names.map((n) => db.insert("species", ["name"], [n]));
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM species";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
