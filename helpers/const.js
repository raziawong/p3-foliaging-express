const titles = {
  plant: "Plant Specification",
  planter: "Planter Specification",
  supply: "Supply Specification",
};
const variables = {
  success: "success_messages",
  error: "error_messages",
};
const messages = {
  createSuccess: (title, name) => `New ${title}, ${name}, has been created`,
  createError: (title) =>
    `${title} create operation encountered an error, please try again.`,
  updateSuccess: (title, name) => `${title}, ${name}, has been update`,
  updateError: (title) =>
    `${title} update operation encountered an error, please try again.`,
  deleteSuccess: (title, name) => `${title}, ${name}, has been deleted`,
  deleteError: (title) =>
    `${title} delete operation encountered an error, please try again.`,
};

module.exports = {
  titles,
  variables,
  messages,
};
