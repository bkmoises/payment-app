const db = require("../database/database");
const message = require("../helpers/messages");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createAccount: async (userId) => {
    try {
      if (!userId) return HttpError.badRequest(message.isRequired("userId"));

      const existingUser = await db.findUser(userId);

      if (!existingUser) return HttpError.badRequest(message.userNotFound);

      if (!existingUser.status)
        return HttpError.badRequest(message.inactiveUser);

      const existingAccount = await db.findAccountByUserId(userId);

      if (existingAccount)
        return HttpError.badRequest(message.userAlreadyExist);

      const account = await db.createAccount(userId);

      return HttpResponse.created(account);
    } catch (error) {
      return HttpError.internal(message.errorToCreateAccount);
    }
  },

  getAllAccounts: async () => {
    try {
      const accounts = await db.findAccount();

      return HttpResponse.success(message.successGetAccounts, accounts);
    } catch (error) {
      return HttpError.internal(message.errorToGetAccounts);
    }
  },

  getOneAccount: async (id) => {
    try {
      const account = await db.findAccount(id);
      if (!account) return HttpResponse.notFound(message.accountNotFound);

      return HttpResponse.success(message.successGetAccount, account);
    } catch (error) {
      return HttpError.internal(message.errorToGetAccount);
    }
  },

  updateOneAccount: async (id, data) => {
    try {
      await db.updateAccount(id, data);

      return HttpResponse.success(message.successUpdateAccount);
    } catch (error) {
      return HttpError.internal(message.errorToUpdateAccount);
    }
  },

  deleteOneAccount: async (id) => {
    try {
      await db.deleteAccount(id);

      return HttpResponse.deleted();
    } catch (error) {
      return HttpError.internal(message.errorToDeleteAccount);
    }
  },
};
