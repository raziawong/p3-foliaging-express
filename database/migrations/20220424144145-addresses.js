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
  return db.createTable("addresses", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    line_1: { type: "string", length: 100, notNull: true },
    line_2: { type: "string", length: 100, notNull: false },
    floor_number: { type: "string", length: 2, notNull: false },
    unit_number: { type: "string", length: 5, notNull: false },
    postal_code: { type: "string", length: 6, notNull: true },
    address_type_id: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "FK_addresses_address_types_address_type_id",
        table: "address_types",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    user_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_addresses_users_user_id",
        table: "users",
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
  const foreignKeys = [
    "FK_addresses_address_types_address_type_id",
    "FK_addresses_users_user_id",
  ];
  const promises = foreignKeys.map((fk) =>
    db.removeForeignKey("addresses", fk)
  );
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("addresses");
    });
  } catch (err) {
    console.log("Encountered error when dropping <addresses> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
