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
  return db.createTable("plants", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    name: { type: "string", length: 150, unique: true, notNull: true },
    alias: { type: "string", length: 150, notNull: false },
    description: { type: "string", length: 200, notNull: false },
    details: { type: "text", notNull: false },
    plant_guide: { type: "text", notNull: false },
    species_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: "FK_plants_species_species_id",
        table: "species",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    care_level_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: "FK_plants_care_levels_care_level_id",
        table: "care_levels",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    water_frequency_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: "FK_plants_water_frequencies_water_frequency_id",
        table: "water_frequencies",
        mapping: "id",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
      },
    },
    light_requirement_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      defaultValue: 1,
      foreignKey: {
        name: "FK_plants_light_requirements_light_requirement_id",
        table: "light_requirements",
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
    "FK_plants_species_species_id",
    "FK_plants_care_levels_care_level_id",
    "FK_plants_water_frequencies_water_frequency_id",
    "FK_plants_light_requirements_light_requirement_id",
  ];
  const promises = foreignKeys.map((fk) => db.removeForeignKey("plants", fk));
  let ret = null;
  try {
    ret = Promise.allSettled(promises).then(() => {
      db.dropTable("plants");
    });
  } catch (err) {
    console.log("Encountered error when dropping <plants> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
