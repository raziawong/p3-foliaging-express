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
  return db.createTable("attributes_plants", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    attribute_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_attributes_plants_attribute_id",
        table: "attributes",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    plant_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_attributes_plants_plant_id",
        table: "plants",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
  });
};

exports.down = function (db) {
  const foreignKeys = [
    "FK_attributes_plants_attribute_id",
    "FK_attributes_plants_plant_id",
  ];
  const promises = foreignKeys.map((fk) =>
    db.removeForeignKey("attributes_plants", fk)
  );
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("attributes_plants");
    });
  } catch (err) {
    console.log("Encountered error when dropping <attributes_plants> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
