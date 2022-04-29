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
  return db.createTable("customers", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    username: { type: "string", length: 20, unique: true, notNull: true },
    first_name: { type: "string", length: 50, notNull: false },
    last_name: { type: "string", length: 50, notNull: false },
    email: { type: "string", length: 320, unique: true, notNull: true },
    password: { type: "string", length: 150, notNull: true },
    contact_number: { type: "string", length: 15, notNull: false },
    created_date: { type: "datetime", notNull: true },
    modified_date: { type: "datetime", notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("customers");
};

exports._meta = {
  version: 1,
};
