const accDb = require("../models/accounts");

module.exports = {
  createAccount: async (userId) => {
    if (!userId) {
      return {
        statusCode: 400,
        error: "O campo userId é requerido",
      };
    }

    const account = await accDb.create(userId);

    return {
      statusCode: 201,
      account,
    };
  },
};
