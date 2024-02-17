const mongoose = require("mongoose");
const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");

module.exports = {
  getTransactions: async () => {
    const transactionList = await dbTrans.find();

    return {
      statusCode: 200,
      transactionList,
    };
  },

  getTransaction: async (id) => {
    const transaction = await dbTrans.findOne(id);

    return {
      statusCode: 200,
      transaction,
    };
  },

  revertTransaction: async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await dbTrans.findOne(id).session(session);
      const { payer, payee, value } = transaction;

      await dbAccount.updateOne(
        { userId: payer },
        { $inc: { balance: value } },
        { session },
      );
      await dbAccount.updateOne(
        { userId: payee },
        { $inc: { balance: -value } },
        { session },
      );

      await dbTrans.updateOne(id, { reverted: true }, { session });

      await session.commitTransaction();
      session.endSession();

      return {
        statusCode: 200,
        message: "Transação revertida com sucesso",
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        statusCode: 500,
        error: "Erro ao reverter a transação",
      };
    }
  },
};
