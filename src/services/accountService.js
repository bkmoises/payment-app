const userDb = require("../models/users");
const accountDb = require("../models/accounts");
const messageHelper = require("../helpers/messages");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createAccount: async (userId) => {
    try {
      if (!userId)
        return HttpError.badRequest(messageHelper.isRequired("userId"));

      const existingUser = await userDb.findById(userId);

      if (!existingUser)
        return HttpError.badRequest(messageHelper.userNotFound);

      if (!existingUser.status)
        return HttpError.badRequest(messageHelper.inactiveUser);

      const existingAccount = await accountDb.findOne({ userId });

      if (existingAccount)
        return HttpError.badRequest(messageHelper.userAlreadyExist);

      const account = await accountDb.create({ userId });

      return HttpResponse.created(account);
    } catch (error) {
      return HttpError.internal(messageHelper.errorToCreateAccount);
    }
  },

  getAllAccounts: async () => {
    try {
      const accountList = await accountDb.find();

      return HttpResponse.success(
        messageHelper.successGetAccounts,
        accountList,
      );
    } catch (error) {
      return HttpError.internal(messageHelper.errorToGetAccounts);
    }
  },

  getOneAccount: async (id) => {
    try {
      const account = await accountDb.findOne(id);
      if (!account) return HttpResponse.notFound(messageHelper.accountNotFound);

      return HttpResponse.success(messageHelper.successGetAccount, account);
    } catch (error) {
      return HttpError.internal(messageHelper.errorToGetAccount);
    }
  },

  updateOneAccount: async (id, data) => {
    try {
      await accountDb.updateOne(id, data);

      return HttpResponse.success(messageHelper.successUpdateAccount);
    } catch (error) {
      return HttpError.internal(messageHelper.errorToUpdateAccount);
    }
  },

  deleteOneAccount: async (id) => {
    try {
      await accountDb.deleteOne(id);

      return HttpResponse.deleted();
    } catch (error) {
      return HttpError.internal(messageHelper.errorToDeleteAccount);
    }
  },
};
