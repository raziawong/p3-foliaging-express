const dbm = require("./db-migrate-instance")();

main = () => {
  dbm
    .down(50)
    .then(() => {
      console.log("----- Migrations reverted successfully -----");
      return;
    })
    .catch((err) => {
      console.error(err);
      console.log("----- Migrations revert failed -----");
      return;
    });
};

main();
