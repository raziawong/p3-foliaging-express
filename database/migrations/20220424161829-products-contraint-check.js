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
  const sql = `ALTER TABLE products 
    ADD CONSTRAINT CT_plant_planter_supply_column_check
    CHECK ( (plant_id IS NOT NULL) OR (planter_id IS NOT NULL) OR (supply_id IS NOT NULL) )`;
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports.down = function (db) {
  const sql = `ALTER TABLE products
    DROP CONSTRAINT CT_plant_planter_supply_column_check`;
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
