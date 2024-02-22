const userDb = require("../models/users");
const accountDb = require("../models/accounts");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createAccount: async (userId) => {
    try {
      if (!userId) return HttpError.badRequest("O campo userId é requerido");

      const existingUser = await userDb.findById(userId);

      if (!existingUser)
        return HttpError.badRequest("O usuário informado não existe");

      if (!existingUser.status)
        return HttpError.badRequest("O usuário informado está inativo");

      const existingAccount = await accountDb.findOne({ userId });

      if (existingAccount)
        return HttpError.badRequest("Este usuário já possui uma conta");

      const account = await accountDb.create({ userId });

      return HttpResponse.created(account);
    } catch (error) {
      return HttpError.internal("Erro ao criar conta");
    }
  },

  getAllAccounts: async () => {
    try {
      const accountList = await accountDb.find();

      return HttpResponse.success(
        "Contas recuperadas com sucesso",
        accountList,
      );
    } catch (error) {
      return HttpError.internal("Erro ao recuperar contas");
    }
  },

  getOneAccount: async (id) => {
    try {
      const account = await accountDb.findOne(id);
      if (!account) return HttpResponse.notFound("Conta não encontrada");

      return HttpResponse.success("Conta recuperada com sucesso", account);
    } catch (error) {
      return HttpError.internal("Erro ao recuperar conta");
    }
  },

  updateOneAccount: async (id, data) => {
    try {
      await accountDb.updateOne(id, data);

      return HttpResponse.success("Conta alterada com sucesso");
    } catch (error) {
      return HttpError.internal("Erro ao atualizar dados da conta");
    }
  },

  deleteOneAccount: async (id) => {
    try {
      await accountDb.deleteOne(id);

      return HttpResponse.deleted();
    } catch (error) {
      return HttpError.internal("Erro ao remover conta");
    }
  },
};
