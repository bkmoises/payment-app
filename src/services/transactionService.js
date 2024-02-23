const db = require("../database/database");
const message = require("../helpers/messages");
const { HttpResponse, HttpError } = require("../helpers/httpResponse");

module.exports = {
  createTransaction: async (transaction) => {
    try {
      const { payer, payee, value } = transaction;

      const isSeller = await db.findUser(payer);

      if (isSeller.seller) return HttpError.badRequest(message.notAllowed);

      const { balance } = await db.findAccountByUserId(payer);

      if (balance < value)
        return HttpError.badRequest(message.insufficientFunds);

      const newTransaction = await db.createTransaction(transaction);

      await db.transferMoney(payer, payee, value);

      return HttpResponse.success(
        message.successCreateTransaction,
        newTransaction,
      );
    } catch (error) {
      return HttpError.internal(message.errorToCreateTransaction);
    }
  },

  getTransactions: async () => {
    try {
      const transactions = await db.findTransaction();

      return HttpResponse.success(
        message.successCreateTransaction,
        transactions,
      );
    } catch (error) {
      return HttpError.internal(message.errorToGetTransactions);
    }
  },

  getTransaction: async (id) => {
    try {
      const transaction = await db.findTransaction(id);

      if (!transaction)
        return HttpResponse.notFound(message.transactionNotFound);

      return HttpResponse.success(message.successGetTransaction, transaction);
    } catch (error) {
      return HttpError.internal(message.errorToGetTransaction);
    }
  },

  revertTransaction: async (id) => {
    try {
      const transaction = await db.findTransaction(id);

      const { payer, payee, value } = transaction;

      await db.revertTransaction(id, payer, payee, value);

      return HttpResponse.success(message.successToRevertTransaction);
    } catch (error) {
      return HttpError.internal(message.errorToRevertTransaction);
    }
  },
};
