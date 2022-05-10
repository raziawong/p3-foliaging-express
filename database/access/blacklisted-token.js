const { BlacklistedToken } = require("../models");

const getBlacklistedToken = async (token) => {
  try {
    return await BlacklistedToken.where({ token }).fetch({ require: false });
  } catch (err) {
    console.error(err);
    return false;
  }
};

const addBlacklistedToken = async (data) => {
  try {
    const token = new BlacklistedToken.set(data);
    await token.save();
    return token;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  getBlacklistedToken,
  addBlacklistedToken,
};
