const accDb = require("../models/accounts");

module.exports = {
  createAccount: async (userId) => {
    if (!userId) {
      return {
        statusCode: 400,
        error: "O campo userId é requerido",
      };
    }

    const existingAccount = await accDb.findOne({ userId });

    if (existingAccount) {
      return {
        statusCode: 400,
        error: "Usuário já possui uma conta",
      };
    }

    const account = await accDb.create({ userId });

    return {
      statusCode: 201,
      account,
    };
  },

  getAllAccounts: async () => {
    const accountList = await accDb.find();

    return {
      statusCode: 200,
      accountList,
    };
  },

  getOneAccount: async (id) => {
    const account = await accDb.findOne({ _id: id });

    if (!account) {
      return {
        statusCode: 404,
        error: "Usuário não encontrado",
      };
    }

    return {
      statusCode: 200,
      account,
    };
  },

  updateOneAccount: async (id, data) => {
    await accDb.updateOne(id, data);
    return {
      statusCode: 200,
      message: "Conta alterada com sucesso",
    };
  },

  deleteOneAccount: async (id) => {
    await accDb.deleteOne({ _id: id });

    return { statusCode: 204 };
  },
};
