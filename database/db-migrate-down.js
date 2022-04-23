const dbm = require("./db-migrate-instance")();

main = () => {
  dbm
    .down()
    .then(() => {
      console.log("Migrations reverted successfully");
      return;
    })
    .catch((err) => {
      console.log("Migrations revert have failed");
      return;
    });
};

main();
