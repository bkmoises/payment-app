const dbTrans = require("../models/transaction");

module.exports = {
  makeTransfer: async (req, res) => {
    const { payer, payee, value } = req.body;
    const transaction = { payer, payee, value };

    const newTransaction = await dbTrans.create(transaction);

    return res.status(200).json(newTransaction);
  },

  getAllTransactions: async (_req, res) => {
    const transactionList = await dbTrans.find();
    return res.status(200).json(transactionList);
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ transactionId: id });
  },

  revertTransaction: async (req, res) => {
    const { id } = req.params;
    return res.status(200).json({ transactionId: id, reverted: true });
  },
};
