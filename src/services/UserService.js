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

  getUser: async (id) => {
    try {
      const user = await db.findOne({ _id: id });

      return {
        statusCode: 200,
        user,
      };
    } catch (e) {
      return {
        statusCode: 400,
        error: "Usuário não encontrado",
      };
    }
  },

  updateUser: async (id, user) => {
    const modifiedUser = await db.updateOne(id, user);

    return {
      statusCode: 200,
      message: "Usuário alterado com sucesso",
    };
  },

  deleteUser: async (id) => {
    await db.deleteOne(id);

    return { statusCode: 204 };
  },
};
