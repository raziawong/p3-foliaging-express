require("dotenv").config();
const dbMigrate = require("db-migrate");

const getDBM = () => {
  const opts = {
    cwd: __dirname,
    config: {
      dev: {
        driver: process.env.DB_DRIVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        ssl: false,
      },
    },
  };

  return dbMigrate.getInstance(true, opts);
};

module.exports = getDBM;
