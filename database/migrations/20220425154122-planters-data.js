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
      name: "Ricardo Pot",
      type_id: 7,
      material_id: 3,
    },
    {
      name: "Remo Planter",
      type_id: 3,
      material_id: 3,
    },
    {
      name: "Dez Pot",
      type_id: 3,
      material_id: 3,
    },
  ];
  const promises = values.map((v) =>
    db.insert(
      "planters",
      ["name", "type_id", "material_id"],
      [v.name, v.type_id, v.material_id]
    )
  );
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM planters";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
