const accDb = require("../models/accounts");

module.exports = {
  createAccount: async (userId) => {
    try {
      // Verifica se o userId foi fornecido
      if (!userId) {
        return {
          statusCode: 400,
          error: "O campo userId é requerido",
        };
      }

      // Verifica se o usuário já possui uma conta
      const existingAccount = await accDb.findOne({ userId });
      if (existingAccount) {
        return {
          statusCode: 400,
          error: "Este usuário já possui uma conta",
        };
      }

      // Cria uma nova conta para o usuário
      const account = await accDb.create({ userId });

      return {
        statusCode: 201,
        account,
      };
    } catch (error) {
      // Em caso de erro desconhecido, retorna um status de erro interno do servidor
      return {
        statusCode: 500,
        error: "Erro ao criar conta",
      };
    }
  },

  getAllAccounts: async () => {
    try {
      // Obtém a lista de todas as contas
      const accountList = await accDb.find();

      return {
        statusCode: 200,
        accountList,
      };
    } catch (error) {
      // Em caso de erro, retorna um status de erro interno do servidor
      return {
        statusCode: 500,
        error: "Erro ao recuperar contas",
      };
    }
  },

  getOneAccount: async (id) => {
    try {
      const account = await accDb.findOne({ _id: id });
      if (!account) {
        return {
          statusCode: 404,
          error: "Conta não encontrada",
        };
      }

      return {
        statusCode: 200,
        account,
      };
    } catch (error) {
      return {
        statusCode: 500,
        error: "Erro ao recuperar conta",
      };
    }
  },

  updateOneAccount: async (id, data) => {
    try {
      await accDb.updateOne(id, data);
      return {
        statusCode: 200,
        message: "Conta alterada com sucesso",
      };
    } catch (error) {
      return {
        statusCode: 500,
        error: "Erro ao atualizar dados da conta",
      };
    }
  },

  deleteOneAccount: async (id) => {
    await accDb.deleteOne({ _id: id });

    return { statusCode: 204 };
  },
};
