const mongoose = require("mongoose");
const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");

module.exports = {
  createTransaction: async (transaction) => {
    try {
      const { payer, payee, value } = transaction;

      const isSeller = await dbUser.findOne({ _id: payer });

      if (isSeller.seller)
        return {
          statusCode: 400,
          error: "Operação não permitida",
        };

      const { balance } = await dbAccount.findOne({ userId: payer });

      if (balance < value)
        return {
          statusCode: 400,
          error: "Saldo insuficiente",
        };

      const newTransaction = await dbTrans.create(transaction);

      await dbAccount.updateOne(
        { userId: payer },
        { balance: balance - value },
      );
      await dbAccount.updateOne(
        { userId: payee },
        { balance: balance + value },
      );
      return {
        statusCode: 200,
        newTransaction,
      };
    } catch (error) {
      return {
        statusCode: 500,
        error: "Erro ao realizar transação",
      };
    }
  },

  getTransactions: async () => {
    try {
      const transactionList = await dbTrans.find();

      return {
        statusCode: 200,
        transactionList,
      };
    } catch (error) {
      return {
        statusCode: 500,
        error: "Erro ao resgatar transações",
      };
    }
  },

  getTransaction: async (id) => {
    try {
      const transaction = await dbTrans.findOne(id);

      if (!transaction)
        return { statusCode: 400, error: "Transação não encontrada" };

      return {
        statusCode: 200,
        transaction,
      };
    } catch (error) {
      return {
        statusCode: 500,
        error: "Erro ao resgatar transação",
      };
    }
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
