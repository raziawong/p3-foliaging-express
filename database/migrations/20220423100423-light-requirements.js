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
  return db.createTable("light_requirements", {
    id: { type: "int", primaryKey: true, autoIncrement: true },
    requirement: { type: "string", length: 80, unique: true, notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("light_requirements");
};

exports._meta = {
  version: 1,
};
