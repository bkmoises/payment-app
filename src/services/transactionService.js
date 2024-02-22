const mongoose = require("mongoose");
const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createTransaction: async (transaction) => {
    try {
      const { payer, payee, value } = transaction;

      const isSeller = await dbUser.findById(payer);

      if (isSeller.seller)
        return HttpError.badRequest("Operação não permitida");

      const { balance } = await dbAccount.findOne({ userId: payer });

      if (balance < value) return HttpError.badRequest("Saldo insuficiente");

      const newTransaction = await dbTrans.create(transaction);

      await dbAccount.updateOne(
        { userId: payer },
        { balance: balance - value },
      );
      await dbAccount.updateOne(
        { userId: payee },
        { balance: balance + value },
      );

      return HttpResponse.success(
        "Transação realizada com sucesso",
        newTransaction,
      );
    } catch (error) {
      return HttpError.internal("Erro ao realizar transação");
    }
  },

  getTransactions: async () => {
    try {
      const transactionList = await dbTrans.find();

      return HttpResponse.success(
        "Transações recuperadas com sucesso",
        transactionList,
      );
    } catch (error) {
      return HttpError.internal("Erro ao resgatar transações");
    }
  },

  getTransaction: async (id) => {
    try {
      const transaction = await dbTrans.findById(id);

      if (!transaction)
        return HttpResponse.notFound("Transação não encontrada");

      return HttpResponse.success(
        "Transação recuperada com sucesso",
        transaction,
      );
    } catch (error) {
      return HttpError.internal("Erro ao resgatar transação");
    }
  },

  revertTransaction: async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await dbTrans.findById(id).session(session);

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

      await dbTrans.findByIdAndUpdate(id, { reverted: true }, { session });

      await session.commitTransaction();
      session.endSession();

      return HttpResponse.success("Transação revertida com sucesso");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return HttpError.internal("Erro ao reverter a transação");
    }
  },
};
