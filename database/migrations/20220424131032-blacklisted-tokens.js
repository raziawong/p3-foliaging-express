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
  return db.createTable("blacklisted_tokens", {
    id: {
      type: "bigint",
      primaryKey: true,
      unsigned: true,
      autoIncrement: true,
    },
    token: { type: "string", length: 5000, notNull: true },
    created_date: { type: "datetime", notNull: true },
  });
};

exports.down = function (db) {
  const sql = "DELETE FROM blacklisted_tokens";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
