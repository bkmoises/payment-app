const transactionService = require("../services/transaction");
const transaction = require("../models/transaction");

module.exports = {
  makeTransfer: async (req, res) => {
    const { payer, payee, value } = req.body;

    const transaction = { payer, payee, value };

    const { data, statusCode, error } =
      await transactionService.createTransaction(transaction);

    return res.status(statusCode).json(data || { error });
  },

  getAllTransactions: async (_req, res) => {
    const { data, statusCode, error } =
      await transactionService.getTransactions();

    return res.status(statusCode).json(data || { error });
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;
    const { data, statusCode, error } =
      await transactionService.getTransaction(id);

    return res.status(statusCode).json(data || { error });
  },

  revertTransaction: async (req, res) => {
    const { id } = req.params;

    const { statusCode, message, error } =
      await transactionService.revertTransaction(id);

    return res.status(statusCode).json(error ? { error } : { message });
  },
};
