const accDb = require("../models/accounts");
const accountService = require("../services/accountService");

module.exports = {
  createAccount: async (req, res) => {
    const { userId } = req.body;
    const { account, statusCode, error } =
      await accountService.createAccount(userId);

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json(account);
  },

  getAllAccounts: async (_req, res) => {
    const accountList = await accDb.find();
    return res.status(200).json(accountList);
  },

  getOneAccount: async (req, res) => {
    const { id } = req.params;
    const account = await accDb.findOne({ _id: id });
    return res.status(200).json(account);
  },

  updateOneAccount: async (req, res) => {
    const { id } = req.params;
    const { balance, status } = req.body;

    await accDb.updateOne({ _id: id }, { balance, status });
    return res.status(200).json({ message: "Conta alterada com sucesso" });
  },

  deleteOneAccount: async (req, res) => {
    const { id } = req.params;
    await accDb.deleteOne({ _id: id });
    return res.status(204).json();
  },
};
