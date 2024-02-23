const db = require("../database/database");
const message = require("../helpers/messages");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createUser: async (user) => {
    try {
      const requiredFields = Object.keys(user);
      for (const field of requiredFields) {
        if (!user[field])
          return HttpError.badRequest(message.isRequired(field));
      }

      const { cpf, mail } = user;

      const existingUser = await db.findByEmailAndCpf(mail, cpf);

      if (existingUser) {
        if (existingUser.cpf === cpf)
          return HttpError.badRequest(message.cpfAlreadyExist);

        if (existingUser.mail === mail)
          return HttpError.badRequest(message.emailAlreadyExist);
      }

      const newUser = await db.createUser(user);

      return HttpResponse.created(newUser);
    } catch (error) {
      return HttpError.internal(message.errorToCreateUser);
    }
  },

  getAllUsers: async () => {
    try {
      const users = await db.findUser();

      return HttpResponse.success(message.successGetUsers, users);
    } catch (error) {
      return HttpError.internal(message.errorToGetUsers);
    }
  },

  getUser: async (id) => {
    try {
      const user = await db.findUser(id);

      if (!user) return HttpResponse.notFound(message.userNotFound);

      return HttpResponse.success(message.successGetUser, user);
    } catch (error) {
      return HttpError.internal(message.errorToGetUser);
    }
  },

  updateUser: async (id, user) => {
    try {
      await db.updateUser(id, user);

      return HttpResponse.success(message.successUpdateUser);
    } catch (error) {
      return HttpError.internal(message.errorToUpdateUser);
    }
  },

  deleteUser: async (id) => {
    try {
      await db.deleteUser(id);

      return HttpResponse.deleted();
    } catch (error) {
      return HttpError.internal(message.errorToDeleteUser);
    }
  },
};
