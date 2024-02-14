const db = require("../models/users");

module.exports = {
  createUser: async (user) => {
    const { cpf, mail } = user;
    const requiredFields = Object.keys(user);

    for (const field of requiredFields) {
      if (!user[field]) {
        return {
          statusCode: 400,
          error: `O campo ${field} é requerido`,
        };
      }
    }

    const dataVerify = await db.findOne({ $or: [{ cpf }, { mail }] });

    if (dataVerify) {
      if (dataVerify.cpf === cpf) {
        return {
          statusCode: 400,
          error: "CPF já cadastrado no sistema",
        };
      }
      if (dataVerify.mail === mail) {
        return {
          statusCode: 400,
          error: "Email já cadastrado no sistema",
        };
      }
    }

    const newUser = await db.create(user);

    return {
      statusCode: 201,
      newUser,
    };
  },

  /**
   * Obtém todos os usuários do banco de dados.
   * @returns {Object} Um objeto contendo statusCode e usuários.
   */
  getAllUsers: async () => {
    try {
      // Consulta ao banco de dados para obter todos os usuários
      const userList = await db.find();

      // Retorna os usuários com o status de sucesso
      return {
        statusCode: 200,
        users: userList,
      };
    } catch (error) {
      // Em caso de erro, retorna um objeto com status de erro e mensagem
      return {
        statusCode: 500,
        error: "Erro ao recuperar usuários do banco de dados",
      };
    }
  },

  /**
   * Obtém um usuário pelo ID.
   * @param {string} id - O ID do usuário a ser obtido.
   * @returns {Object} Um objeto contendo statusCode e usuário.
   */
  getUser: async (id) => {
    try {
      // Consulta ao banco de dados para obter o usuário com o ID fornecido
      const user = await db.findOne({ _id: id });

      // Verifica se o usuário foi encontrado
      if (!user) {
        return {
          statusCode: 404,
          error: "Usuário não encontrado",
        };
      }

      // Retorna o usuário com o status de sucesso
      return {
        statusCode: 200,
        user,
      };
    } catch (error) {
      // Em caso de erro desconhecido, retorna um objeto com status de erro e mensagem
      return {
        statusCode: 500,
        error: "Erro ao recuperar usuário",
      };
    }
  },

  /**
   * Atualiza um usuário pelo ID.
   * @param {string} id - O ID do usuário a ser atualizado.
   * @param {Object} user - O objeto contendo os dados atualizados do usuário.
   * @returns {Object} Um objeto indicando o status da operação.
   */
  updateUser: async (id, user) => {
    try {
      // Atualiza o usuário no banco de dados
      await db.updateOne(id, user);

      // Retorna um status de sucesso
      return {
        statusCode: 200,
        message: "Usuário alterado com sucesso",
      };
    } catch (error) {
      // Em caso de erro, retorna um objeto com status de erro e mensagem
      return {
        statusCode: 500,
        error: "Erro ao alterar usuário",
      };
    }
  },

  /**
   * Exclui um usuário pelo ID.
   * @param {string} id - O ID do usuário a ser excluído.
   * @returns {Object} Um objeto indicando o status da operação.
   */
  deleteUser: async (id) => {
    try {
      // Exclui o usuário do banco de dados
      await db.deleteOne({ _id: id });

      // Retorna um status de sucesso
      return { statusCode: 204 };
    } catch (error) {
      // Em caso de erro, retorna um objeto com status de erro e mensagem
      return {
        statusCode: 500,
        error: "Erro ao excluir usuário",
      };
    }
  },
};
