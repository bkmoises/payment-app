const accDb = require("../models/accounts");
const accountService = require("../services/accountService");

module.exports = {
  createAccount: async (req, res) => {
    const { userId } = req.body;
    const { account, statusCode, error } =
      await accountService.createAccount(userId);

    return res.status(statusCode).json(account || { error });
  },

  getAllAccounts: async (_req, res) => {
    const { accountList, statusCode, error } =
      await accountService.getAllAccounts();
    return res.status(statusCode).json(accountList || { error });
  },

  getOneAccount: async (req, res) => {
    const { id } = req.params;
    const { account, statusCode, error } = await accountService.getOneAccount({
      _id: id,
    });

    return res.status(statusCode).json(account || { error });
  },

  updateOneAccount: async (req, res) => {
    const { id } = req.params;
    const { balance, status } = req.body;

    const { message, statusCode } = await accountService.updateOneAccount(
      { _id: id },
      { balance, status },
    );
    return res.status(statusCode).json({ message });
  },

  deleteOneAccount: async (req, res) => {
    const { id } = req.params;
    const { statusCode } = await accountService.deleteOneAccount({ _id: id });
    return res.status(statusCode).json();
  },
};
