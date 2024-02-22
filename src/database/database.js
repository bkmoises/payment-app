const user = require("../models/users");
const account = require("../models/accounts");
const transaction = require("../models/transaction");

module.exports = {
  findUsers: async () => user.find(),
  findAccounts: async () => account.find(),
  findTransactions: async () => transaction.find(),

  createUser: async (data) => user.create(data),
  createAccount: async (userId) => account.create({ userId }),
  createTransaction: async (data) => transaction.create(data),
  revertTransaction: async (id) =>
    transaction.findByIdAndUpdate(id, { reverted: true }),

  findUser: async (id) => user.findById(id),
  findAccount: async (id) => account.findById(id),
  findTransaction: async (id) => transaction.findById(id),
  findAccountByUserId: async (userId) => account.findOne({ userId }),
  findByEmailAndCpf: async (mail, cpf) =>
    user.findOne({ $or: [{ mail }, { cpf }] }),

  updateUser: async (id, data) => user.findByIdAndUpdate(id, data),
  updateAccount: async (id, data) => account.findByIdAndUpdate(id, data),

  deleteUser: async (id) => user.findByIdAndDelete(id),
  deleteAccount: async (id) => account.findByIdAndDelete(id),

  transferMoney: async (payer, payee, value) =>
    account.bulkWrite([
      {
        updateOne: {
          filter: { userId: payer },
          update: { $inc: { balance: -value } },
        },
      },
      {
        updateOne: {
          filter: { userId: payee },
          update: { $inc: { balance: value } },
        },
      },
    ]),

  returnValues: async (payer, payee, value) =>
    account.bulkWrite([
      {
        updateOne: {
          filter: { userId: payer },
          update: { $inc: { balance: value } },
        },
      },
      {
        updateOne: {
          filter: { userId: payee },
          update: { $inc: { balance: -value } },
        },
      },
    ]),
};
