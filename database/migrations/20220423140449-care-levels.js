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
  return db.createTable("care_levels", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    level: { type: "string", length: 50, unique: true, notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("care_levels");
};

exports._meta = {
  version: 1,
};
