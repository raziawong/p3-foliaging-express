const dbm = require("./db-migrate-instance")();

main = () => {
  dbm
    .up()
    .then(() => {
      console.log("Migrations completed successfully");
      return;
    })
    .catch((err) => {
      console.log("Migrations have failed");
      return;
    });
};

main();
