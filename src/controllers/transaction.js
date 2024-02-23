const service = require("../services/transaction");

module.exports = {
  makeTransfer: async (req, res) => {
    const { payer, payee, value } = req.body;

    const transaction = { payer, payee, value };

    const { data, statusCode, error } =
      await service.createTransaction(transaction);

    return res.status(statusCode).json(data || { error });
  },

  getAllTransactions: async (_req, res) => {
    const { data, statusCode, error } = await service.getTransactions();

    return res.status(statusCode).json(data || { error });
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;
    const { data, statusCode, error } = await service.getTransaction(id);

    return res.status(statusCode).json(data || { error });
  },

  revertTransaction: async (req, res) => {
    const { id } = req.params;

    const { statusCode, message, error } = await service.revertTransaction(id);

    return res.status(statusCode).json(error ? { error } : { message });
  },
};
