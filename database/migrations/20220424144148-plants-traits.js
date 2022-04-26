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
  return db.createTable("plants_traits", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    trait_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_plants_traits_trait_id",
        table: "traits",
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
        name: "FK_plants_traits_plants_id",
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
    "FK_plants_traits_trait_id",
    "FK_plants_traits_plants_id",
  ];
  const promises = foreignKeys.map((fk) =>
    db.removeForeignKey("plants_traits", fk)
  );
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("plants_traits");
    });
  } catch (err) {
    console.log("Encountered error when dropping <plants_traits> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
