const dbUser = require("../models/users");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");
const messageHelper = require("../helpers/messages");

module.exports = {
  createUser: async (user) => {
    try {
      const requiredFields = Object.keys(user);
      for (const field of requiredFields) {
        if (!user[field])
          return HttpError.badRequest(messageHelper.isRequired(field));
      }

      const { cpf, mail } = user;

      const existingUser = await dbUser.findOne({ $or: [{ cpf }, { mail }] });

      if (existingUser) {
        if (existingUser.cpf === cpf)
          return HttpError.badRequest(messageHelper.cpfAlreadyExist);

        if (existingUser.mail === mail)
          return HttpError.badRequest(messageHelper.emailAlreadyExist);
      }

      const newUser = await dbUser.create(user);

      return HttpResponse.created(newUser);
    } catch (error) {
      return HttpError.internal(messageHelper.errorToCreateUser);
    }
  },

  getAllUsers: async () => {
    try {
      const userList = await dbUser.find();

      return HttpResponse.success(messageHelper.successGetUsers, userList);
    } catch (error) {
      return HttpError.internal(messageHelper.errorToGetUsers);
    }
  },

  getUser: async (id) => {
    try {
      const user = await dbUser.findOne(id);

      if (!user) return HttpResponse.notFound(messageHelper.userNotFound);

      return HttpResponse.success(messageHelper.successGetUser, user);
    } catch (error) {
      return HttpError.internal(messageHelper.errorToGetUser);
    }
  },

  updateUser: async (id, user) => {
    try {
      await dbUser.updateOne(id, user);

      return HttpResponse.success(messageHelper.successUpdateUser);
    } catch (error) {
      return HttpError.internal(messageHelper.errorToUpdateUser);
    }
  },

  deleteUser: async (id) => {
    try {
      await dbUser.deleteOne(id);

      return HttpResponse.deleted();
    } catch (error) {
      return HttpError.internal(messageHelper.errorToDeleteUser);
    }
  },
};
