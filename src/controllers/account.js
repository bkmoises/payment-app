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
    const { data, statusCode, error } = await accountService.getOneAccount(id);

    return res.status(statusCode).json(data || { error });
  },

  updateOneAccount: async (req, res) => {
    const { id } = req.params;
    const { balance, status } = req.body;
    const data = { balance, status };

    const { message, statusCode, error } =
      await accountService.updateOneAccount(id, data);

    return res.status(statusCode).json(error ? { error } : { message });
  },

  deleteOneAccount: async (req, res) => {
    const { id } = req.params;
    const { statusCode, error } = await accountService.deleteOneAccount(id);

    return res.status(statusCode).json({ error });
  },
};
