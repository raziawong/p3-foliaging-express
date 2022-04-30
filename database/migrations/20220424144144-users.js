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
  return db.createTable("users", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    username: { type: "string", length: 20, unique: true, notNull: true },
    email: { type: "string", length: 320, unique: true, notNull: true },
    password: { type: "string", length: 256, notNull: true },
    created_date: { type: "datetime", notNull: true },
    modified_date: { type: "datetime", notNull: true },
    account_type_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      defaultValue: 2,
      foreignKey: {
        name: "FK_users_account_types_account_type_id",
        table: "account_types",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
  });
};

exports.down = function (db) {
  const foreignKeys = ["FK_users_account_types_account_type_id"];
  const promises = foreignKeys.map((fk) => db.removeForeignKey("users", fk));
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("users");
    });
  } catch (err) {
    console.log("Encountered error when dropping <users> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
