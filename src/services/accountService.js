const userDb = require("../models/users");
const accountDb = require("../models/accounts");

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

      // Verifica se existe um usuário com o ID informado
      const existingUser = await userDb.findOne({ _id: userId });
      if (!existingUser) {
        return {
          statusCode: 400,
          error: "O usuário informado não existe",
        };
      }

      // Verifica se o usuário está ativo
      if (!existingUser.status) {
        return {
          statusCode: 400,
          error: "O usuário informado está inativo",
        };
      }

      // Verifica se o usuário já possui uma conta
      const existingAccount = await accountDb.findOne({ userId });
      if (existingAccount) {
        return {
          statusCode: 400,
          error: "Este usuário já possui uma conta",
        };
      }

      // Cria uma nova conta para o usuário
      const account = await accountDb.create({ userId });

      // Em caso de sucesso, retorna uma nova conta
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
      const accountList = await accountDb.find();

      // Em caso de sucesso retorna uma lista de contas
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
      // Procura a conta pelo ID
      const account = await accountDb.findOne(id);
      // Se a conta não for encontrada, retorna um status 404
      if (!account) {
        return {
          statusCode: 404,
          error: "Conta não encontrada",
        };
      }
      // Retorna a conta se encontrada
      return {
        statusCode: 200,
        account,
      };
    } catch (error) {
      // Em caso de erro, retorna um status de erro interno do servidor
      return {
        statusCode: 500,
        error: "Erro ao recuperar conta",
      };
    }
  },

  updateOneAccount: async (id, data) => {
    try {
      // Atualiza os dados da conta com o ID fornecido
      await accountDb.updateOne(id, data);
      // Retorna uma mensagem de sucesso
      return {
        statusCode: 200,
        message: "Conta alterada com sucesso",
      };
    } catch (error) {
      // Em caso de erro, retorna um status de erro interno do servidor
      return {
        statusCode: 500,
        error: "Erro ao atualizar dados da conta",
      };
    }
  },

  deleteOneAccount: async (id) => {
    try {
      // Remove a conta com o ID fornecido
      await accountDb.deleteOne(id);
      // Retorna um status de sucesso sem conteúdo
      return { statusCode: 204 };
    } catch (error) {
      // Em caso de erro, retorna um status de erro interno do servidor
      return {
        statusCode: 500,
        error: "Erro ao remover conta",
      };
    }
  },
};
