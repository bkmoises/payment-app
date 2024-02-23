const user = require("../models/users");
const account = require("../models/accounts");
const transaction = require("../models/transaction");

module.exports = {
  findUser: (id) => {
    if (id) return user.findById(id);
    return user.find();
  },
  findAccount: (id) => {
    if (id) return account.findById(id);
    return account.find();
  },

  findTransaction: (id) => {
    if (id) return transaction.findById(id);
    return transaction.find();
  },

  createUser: (data) => {
    return user.create(data);
  },

  createAccount: (userId) => {
    return account.create({ userId });
  },

  createTransaction: (data) => {
    return transaction.create(data);
  },

  findAccountByUserId: (userId) => {
    return account.findOne({ userId });
  },

  findByEmailAndCpf: (mail, cpf) => {
    return user.findOne({ $or: [{ mail }, { cpf }] });
  },

  updateUser: (id, data) => {
    return user.findByIdAndUpdate(id, data);
  },

  updateAccount: (id, data) => {
    return account.findByIdAndUpdate(id, data);
  },

  deleteUser: (id) => {
    return user.findByIdAndDelete(id);
  },

  deleteAccount: (id) => {
    return account.findByIdAndDelete(id);
  },

  transferMoney: (payer, payee, value) => {
    return account.bulkWrite([
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
    ]);
  },

  revertTransaction: async (id, payer, payee, value) => {
    await account.bulkWrite([
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
    ]);

    return transaction.findByIdAndUpdate(id, { reverted: true });
  },
};
