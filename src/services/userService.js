const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");

module.exports = {
  /**
   * Cria um novo usuário.
   * @param {Object} user - O objeto contendo os dados do usuário a ser criado.
   * @returns {Object} Um objeto indicando o status da operação.
   */
  createUser: async (user) => {
    try {
      const requiredFields = Object.keys(user);
      // Verifica se os campos obrigatórios estão presentes
      for (const field of requiredFields) {
        if (!user[field]) {
          return {
            statusCode: 400,
            error: `O campo ${field} é requerido`,
          };
        }
      }

      // Verifica se o CPF ou o e-mail já estão cadastrados
      const { cpf, mail } = user;
      const existingUser = await dbUser.findOne({ $or: [{ cpf }, { mail }] });

      // Verifica se o CPF ou o e-mail já estão cadastrados
      if (existingUser) {
        if (existingUser.cpf === cpf) {
          return {
            statusCode: 400,
            error: "CPF já cadastrado no sistema",
          };
        }
        if (existingUser.mail === mail) {
          return {
            statusCode: 400,
            error: "Email já cadastrado no sistema",
          };
        }
      }
      // Cria o novo usuário no banco de dados
      const newUser = await dbUser.create(user);
      // Retorna um status de sucesso e o novo usuário
      return {
        statusCode: 201,
        newUser,
      };
    } catch (error) {
      // Em caso de erro, retorna um objeto com status de erro e mensagem
      return {
        statusCode: 500,
        error: "Erro ao criar usuário",
      };
    }
  },

  /**
   * Obtém todos os usuários do banco de dados.
   * @returns {Object} Um objeto contendo statusCode e usuários.
   */
  getAllUsers: async () => {
    try {
      // Consulta ao banco de dados para obter todos os usuários
      const userList = await dbUser.find();

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
      const user = await dbUser.findOne(id);

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
      await dbUser.updateOne(id, user);

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
      await dbUser.deleteOne(id);

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
