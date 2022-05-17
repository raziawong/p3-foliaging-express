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
  return db.createTable("backlog_addresses", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    line_1: { type: "string", length: 100, notNull: true },
    line_2: { type: "string", length: 100, notNull: false },
    floor_number: { type: "string", length: 2, notNull: false },
    unit_number: { type: "string", length: 5, notNull: false },
    postal_code: { type: "string", length: 6, notNull: true },
    label: { type: "string", length: 20, notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("backlog_addresses");
};

exports._meta = {
  version: 1,
};
