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
  return db.createTable("supplies", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    name: { type: "string", length: 150, unique: true, notNull: true },
    description: { type: "string", length: 200, notNull: false },
    details: { type: "text", notNull: false },
    type_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: "FK_supplies_supply_types_type_id",
        table: "planter_types",
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
  const foreignKeys = ["FK_supplies_supply_types_type_id"];
  const promises = foreignKeys.map((fk) => db.removeForeignKey("supplies", fk));
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("supplies");
    });
  } catch (err) {
    console.log("Encountered error when dropping <supplies> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
