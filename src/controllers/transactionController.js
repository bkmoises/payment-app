const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");

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
    const transactionList = await dbTrans.find();
    return res.status(200).json(transactionList);
  },

  getTransactionById: async (req, res) => {
    const { id } = req.params;
    const transaction = await dbTrans.findOne({ _id: id });
    return res.status(200).json(transaction);
  },

  revertTransaction: async (req, res) => {
    const { id } = req.params;
    const { payer, payee, value } = await dbTrans.findOne({ _id: id });

    const { balance: prBalance } = await dbAccount.findOne({ userId: payer });
    const { balance: peBalance } = await dbAccount.findOne({ userId: payee });

    await dbAccount.updateOne(
      { userId: payer },
      { balance: prBalance + value },
    );
    await dbAccount.updateOne(
      { userId: payee },
      { balance: peBalance - value },
    );

    await dbTrans.updateOne({ _id: id }, { reverted: true });
    return res.status(200).json({ message: "Transação revertida com sucesso" });
  },
};
