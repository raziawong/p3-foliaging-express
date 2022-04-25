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
      name: "Perlite",
      type_id: 2,
    },
    {
      name: "Organic Neem Oil",
      type_id: 4,
    },
    {
      name: "Cotton Yarn Rubber Gloves",
      type_id: 1,
    },
  ];
  const promises = values.map((v) =>
    db.insert("supplies", ["name", "type_id"], [v.name, v.type_id])
  );
  return Promise.all(promises);
};

exports.down = function (db) {
  const sql = "DELETE FROM supplies";
  return db.runSql(sql, function (err) {
    if (err) return console.log(err);
  });
};

exports._meta = {
  version: 1,
};
