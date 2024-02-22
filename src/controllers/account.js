const accountService = require("../services/accountService");

module.exports = {
  createAccount: async (req, res) => {
    const { userId } = req.body;
    const { data, statusCode, error } =
      await accountService.createAccount(userId);

    return res.status(statusCode).json(data || { error });
  },

  getAllAccounts: async (_req, res) => {
    const { data, statusCode, error } = await accountService.getAllAccounts();

    return res.status(statusCode).json(data || { error });
  },

  getOneAccount: async (req, res) => {
    const { id } = req.params;
    const { data, statusCode, error } = await accountService.getOneAccount({
      _id: id,
    });

    return res.status(statusCode).json(data || { error });
  },

  updateOneAccount: async (req, res) => {
    const { id } = req.params;
    const { balance, status } = req.body;

    const { message, statusCode, error } =
      await accountService.updateOneAccount({ _id: id }, { balance, status });

    return res.status(statusCode).json(error ? { error } : { message });
  },

  deleteOneAccount: async (req, res) => {
    const { id } = req.params;
    const { statusCode, error } = await accountService.deleteOneAccount({
      _id: id,
    });

    return res.status(statusCode).json({ error });
  },
};
