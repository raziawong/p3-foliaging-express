const { BlacklistedToken } = require("../models");

const addBlacklistToken = async (data) => {
  try {
    const token = new BlacklistedToken().set(data);
    await token.save();
    return token;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  addBlacklistToken,
};
