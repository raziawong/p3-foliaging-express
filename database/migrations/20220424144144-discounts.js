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
  return db.createTable("discounts", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    code: { type: "string", length: 10, unqiue: true, notNull: false },
    title: { type: "string", length: 50, notNull: true },
    percentage: { type: "smallint", notNull: true },
    created_date: { type: "datetime", notNull: true },
    start_date: { type: "datetime", notNull: true },
    end_date: { type: "datetime", notNull: true },
    all_products: { type: "boolean", defaultValue: false, notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("discounts");
};

exports._meta = {
  version: 1,
};
