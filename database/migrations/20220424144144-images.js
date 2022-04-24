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
  return db.createTable("images", {
    id: { type: "int", primaryKey: true, unsigned: true, autoIncrement: true },
    image_url: { type: "string", length: 2048, notNull: true },
    product_id: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "FK_images_products_product_id",
        table: "products",
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
  const foreignKeys = ["FK_images_products_product_id"];
  const promises = foreignKeys.map((fk) => db.removeForeignKey("images", fk));
  let ret = null;
  try {
    ret = Promise.all(promises).then(() => {
      db.dropTable("images");
    });
  } catch (err) {
    console.log("Encountered error when dropping <images> table");
  }
  return ret;
};

exports._meta = {
  version: 1,
};
