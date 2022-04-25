const fs = require("fs");
const dbm = require("./db-migrate-instance")();

main = () => {
  const doDBMCreate = (pattern) => {
    const matches = fs
      .readdirSync(__dirname + "/migrations")
      .filter((path) => path.endsWith(pattern + ".js"));

    if (matches.length === 0) {
      return dbm.create(pattern);
    }
  };

  doDBMCreate("light-requirements");
  doDBMCreate("light-requirements-data");
  doDBMCreate("water-frequencies-data");
  doDBMCreate("care-levels");
  doDBMCreate("care-levels-data");
  doDBMCreate("attributes");
  doDBMCreate("attributes-data");
  doDBMCreate("supply-types");
  doDBMCreate("supply-types-data");
  doDBMCreate("planter-types");
  doDBMCreate("planter-types-data");
  doDBMCreate("planter-materials");
  doDBMCreate("planter-materials-data");
  doDBMCreate("colors");
  doDBMCreate("colors-data");
  doDBMCreate("species");
  doDBMCreate("species-data");
  doDBMCreate("order-statuses");
  doDBMCreate("order-statuses-data");
  doDBMCreate("account-types");
  doDBMCreate("account-types-data");
  doDBMCreate("address-types");
  doDBMCreate("address-types-data");
  doDBMCreate("sizes");
  doDBMCreate("sizes-data");
  setTimeout(() => doDBMCreate("supplies"), 1500);
  setTimeout(() => doDBMCreate("planters"), 1500);
  setTimeout(() => doDBMCreate("plants"), 1500);
  setTimeout(() => doDBMCreate("products"), 3000);
  setTimeout(() => doDBMCreate("images"), 4500);
  setTimeout(() => doDBMCreate("discounts"), 4500);
  setTimeout(() => doDBMCreate("users"), 4500);
  setTimeout(() => doDBMCreate("addresses"), 6000);
  setTimeout(() => doDBMCreate("orders"), 7500);
  setTimeout(() => doDBMCreate("payment-details"), 9000);
  setTimeout(() => doDBMCreate("cart-items"), 9000);
  setTimeout(() => doDBMCreate("ordered-items"), 9000);
  setTimeout(() => doDBMCreate("discounts-products"), 9000);
  setTimeout(() => doDBMCreate("attributes-plants"), 9000);
  setTimeout(() => doDBMCreate("products-contraint-check"), 9000);
};

main();
