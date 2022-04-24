const dbm = require("./db-migrate-instance")();

main = () => {
  dbm
    .up()
    .then(() => {
      console.log("----- Migrations completed successfully -----");
      return;
    })
    .catch((err) => {
      console.error(err);
      console.log("----- Migrations have failed -----");
      return;
    });
};

main();
