const dbMigrate = require("db-migrate");
const assert = require("assert");
require("dotenv").config();

const getDBM = () => {
  const opts = {
    cwd: __dirname,
    config: {
      dev: {
        driver: process.env.DB_DRIVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
  };

  const callback = (migrator, orignalError) => {
    migrator.driver.close((err) => {
      assert.ifError(err);
    });
  };

  return dbMigrate.getInstance(true, opts, callback);
};

module.exports = getDBM;
