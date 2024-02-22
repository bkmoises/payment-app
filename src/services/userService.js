const dbUser = require("../models/users");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createUser: async (user) => {
    try {
      const requiredFields = Object.keys(user);
      for (const field of requiredFields) {
        if (!user[field])
          return HttpError.badRequest(`O campo ${field} é requerido`);
      }

      const { cpf, mail } = user;

      const existingUser = await dbUser.findOne({ $or: [{ cpf }, { mail }] });

      if (existingUser) {
        if (existingUser.cpf === cpf)
          return HttpError.badRequest("CPF já cadastrado no sistema");

        if (existingUser.mail === mail)
          return HttpError.badRequest("Email já cadastrado no sistema");
      }

      const newUser = await dbUser.create(user);

      return HttpResponse.created(newUser);
    } catch (error) {
      return HttpError.internal("Erro ao criar usuário");
    }
  },

  getAllUsers: async () => {
    try {
      const userList = await dbUser.find();

      return HttpResponse.success("Usuários resgatados com sucesso", userList);
    } catch (error) {
      return HttpError.internal("Erro ao recuperar usuários do banco de dados");
    }
  },

  getUser: async (id) => {
    try {
      const user = await dbUser.findOne(id);

      if (!user) return HttpResponse.notFound("Usuário não encontrado");

      return HttpResponse.success("Usuário resgatado com sucesso", user);
    } catch (error) {
      return HttpError.internal("Erro ao recuperar usuário");
    }
  },

  updateUser: async (id, user) => {
    try {
      await dbUser.updateOne(id, user);

      return HttpResponse.success("Usuário alterado com sucesso");
    } catch (error) {
      return HttpError.internal("Erro ao alterar usuário");
    }
  },

  deleteUser: async (id) => {
    try {
      await dbUser.deleteOne(id);

      return HttpResponse.deleted();
    } catch (error) {
      return HttpError.internal("Erro ao excluir usuário");
    }
  },
};
