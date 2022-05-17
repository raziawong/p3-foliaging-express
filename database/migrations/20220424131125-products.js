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
  return db.createTable("products", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    title: { type: "string", length: 150, unique: true, notNull: true },
    height: { type: "smallint", notNull: false },
    width: { type: "smallint", notNull: false },
    weight: { type: "smallint", notNull: false },
    stock: { type: "smallint", notNull: true },
    price: { type: "bigint", notNull: true },
    uploadcare_group_id: { type: "string", length: 100, notNull: true },
    created_date: { type: "datetime", notNull: true },
    modified_date: { type: "datetime", notNull: true },
    plant_id: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "FK_products_plants_plant_id",
        table: "plants",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    planter_id: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "FK_products_planters_planter_id",
        table: "planters",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    supply_id: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "FK_products_supplies_supply_id",
        table: "supplies",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    color_id: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "FK_products_colors_color_id",
        table: "colors",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    size_id: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "FK_products_sizes_size_id",
        table: "sizes",
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
    "FK_products_plants_plant_id",
    "FK_products_planters_planter_id",
    "FK_products_supplies_supply_id",
    "FK_products_colors_color_id",
    "FK_products_sizes_size_id",
  ];
  const promises = foreignKeys.map((fk) => db.removeForeignKey("products", fk));
  let ret = null;
  try {
    ret = Promise.allSettled(promises).then(() => {
      db.dropTable("products");
    });
  } catch (err) {
    console.log("Encountered error when dropping <products> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
