const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");

const transactionService = require("../services/transactionService");
const transaction = require("../models/transaction");

module.exports = {
  makeTransfer: async (req, res) => {
    const { payer, payee, value } = req.body;

    const { newTransaction, statusCode, error } =
      await transactionService.createTransaction({ payer, payee, value });

    return res.status(statusCode).json(newTransaction || { error });
  },

  getAllTransactions: async (_req, res) => {
    const { transactionList, statusCode, error } =
      await transactionService.getTransactions();

    return res.status(statusCode).json(transactionList || { error });
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;
    const { transaction, statusCode, error } =
      await transactionService.getTransaction({ _id: id });

    return res.status(statusCode).json(transaction || { error });
  },

  revertTransaction: async (req, res) => {
    const { id } = req.params;

    const { statusCode, message, error } =
      await transactionService.revertTransaction({ _id: id });

    return res.status(statusCode).json(message ? { message } : { error });
  },
};
