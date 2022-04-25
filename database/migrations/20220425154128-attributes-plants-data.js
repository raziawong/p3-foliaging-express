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
      attribute_id: 1,
      plant_id: 1,
    },
    {
      attribute_id: 2,
      plant_id: 1,
    },
    {
      attribute_id: 3,
      plant_id: 1,
    },
    {
      attribute_id: 4,
      plant_id: 1,
    },
    {
      attribute_id: 1,
      plant_id: 3,
    },
    {
      attribute_id: 2,
      plant_id: 3,
    },
    {
      attribute_id: 6,
      plant_id: 3,
    },
  ];
  const promises = values.map((v) =>
    db.insert(
      "attributes_plants",
      ["attribute_id", "plant_id"],
      [v.attribute_id, v.plant_id]
    )
  );
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM attributes_plants";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
