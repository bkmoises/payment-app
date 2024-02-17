const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");

const transactionService = require("../services/transactionService");
const transaction = require("../models/transaction");

module.exports = {
  makeTransfer: async (req, res) => {
    const { payer, payee, value } = req.body;
    const transaction = { payer, payee, value };

    const isSeller = await dbUser.findOne({ _id: payer });

    if (isSeller.seller)
      return res.status(400).json({ error: "Operação não permitida" });

    const { balance } = await dbAccount.findOne({ userId: payer });

    if (balance < value)
      return res.status(400).json({ error: "Saldo insuficiente" });

    const newTransaction = await dbTrans.create(transaction);

    await dbAccount.updateOne({ userId: payer }, { balance: balance - value });
    await dbAccount.updateOne({ userId: payee }, { balance: balance + value });

    return res.status(200).json(newTransaction);
  },

  getAllTransactions: async (_req, res) => {
    const { transactionList, statusCode } =
      await transactionService.getTransactions();

    return res.status(statusCode).json(transactionList);
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;
    const { transaction, statusCode } = await transactionService.getTransaction(
      { _id: id },
    );

    return res.status(statusCode).json(transaction);
  },

  revertTransaction: async (req, res) => {
    const { id } = req.params;

    const { statusCode, message } = await transactionService.revertTransaction({
      _id: id,
    });

    return res.status(statusCode).json({ message });
  },
};
