const { User, AccountType } = require("../models");

const searchUser = async (query) => {
  try {
    return await User.query(query).fetch({
      require: false,
      withRelated: ["type"],
    });
  } catch (err) {}
  return false;
};

const getUserById = async (id) => {
  try {
    return await User.where({ id }).fetch({
      require: false,
      withRelated: ["type"],
    });
  } catch (err) {}
  return false;
};
const addUser = async (data) => {
  try {
    const user = new User().set(data);
    await user.save();
    return user;
  } catch (err) {}
  return false;
};
const updateUser = async (user, data) => {
  try {
    user.set(data);
    await user.save();
    return user;
  } catch (err) {}
  return false;
};

const getAllAccountTypes = async () => {
  try {
    return await AccountType.fetchAll();
  } catch (err) {}
  return false;
};
const getAllAccountTypesOpts = async () => {
  return await getAllAccountTypes().then((resp) =>
    resp.map((o) => [o.get("id"), o.get("type")])
  );
};

module.exports = {
  searchUser,
  getUserById,
  addUser,
  updateUser,
  getAllAccountTypes,
  getAllAccountTypesOpts,
};
