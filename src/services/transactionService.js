const mongoose = require("mongoose");
const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");
const messageHelper = require("../helpers/messages");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createTransaction: async (transaction) => {
    try {
      const { payer, payee, value } = transaction;

      const isSeller = await dbUser.findById(payer);

      if (isSeller.seller)
        return HttpError.badRequest(messageHelper.notAllowed);

      const { balance } = await dbAccount.findOne({ userId: payer });

      if (balance < value)
        return HttpError.badRequest(messageHelper.insufficientFunds);

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
        messageHelper.successCreateTransaction,
        newTransaction,
      );
    } catch (error) {
      return HttpError.internal(messageHelper.errorToCreateTransaction);
    }
  },

  getTransactions: async () => {
    try {
      const transactionList = await dbTrans.find();

      return HttpResponse.success(
        messageHelper.successCreateTransaction,
        transactionList,
      );
    } catch (error) {
      return HttpError.internal(messageHelper.errorToGetTransactions);
    }
  },

  getTransaction: async (id) => {
    try {
      const transaction = await dbTrans.findById(id);

      if (!transaction)
        return HttpResponse.notFound(messageHelper.transactionNotFound);

      return HttpResponse.success(
        messageHelper.successGetTransaction,
        transaction,
      );
    } catch (error) {
      return HttpError.internal(messageHelper.errorToGetTransaction);
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

      return HttpResponse.success(messageHelper.successToRevertTransaction);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return HttpError.internal(messageHelper.errorToRevertTransaction);
    }
  },
};
