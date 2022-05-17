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
  const values = [
    {
      name: "Golden Pothos",
      alias: "Devil's Ivy",
      species_id: 3,
      care_level_id: 1,
      light_requirement_id: 4,
      water_frequency_id: 2,
    },
    {
      name: "Swiss Cheese Plant",
      alias: "Split-leaf Philodendron",
      species_id: 1,
      care_level_id: 2,
      light_requirement_id: 4,
      water_frequency_id: 2,
    },
    {
      name: "Mother-in-law's Tongue",
      alias: "Snake Plant",
      species_id: 6,
      care_level_id: 1,
      light_requirement_id: 5,
      water_frequency_id: 1,
    },
  ];
  const promises = values.map((v) =>
    db.insert(
      "plants",
      [
        "name",
        "alias",
        "species_id",
        "care_level_id",
        "light_requirement_id",
        "water_frequency_id",
      ],
      [
        v.name,
        v.alias,
        v.species_id,
        v.care_level_id,
        v.light_requirement_id,
        v.water_frequency_id,
      ]
    )
  );
  return Promise.allSettled(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM plants";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
