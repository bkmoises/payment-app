const mongoose = require("mongoose");
const user = require("../models/users");
const account = require("../models/accounts");
const transaction = require("../models/transaction");

module.exports = {
  // Get all data métods
  findUsers: async () => user.find(),
  findAccounts: async () => account.find(),
  findTransactions: async () => transaction.find(),
  // Create métods
  createUser: async (data) => user.create(data),
  createAccount: async (data) => account.create(data),
  createTransaction: async (data) => transaction.create(data),
  // Find métods
  findUser: async (id) => user.findById(id),
  findByEmailAndCpf: async (mail, cpf) =>
    user.findOne({ $or: [{ mail }, { cpf }] }),

  // Update métods
  updateUser: async (id, data) => user.findByIdAndUpdate(id, data),

  // Delete métods
  deleteUser: async (id) => user.findByIdAndDelete(id),
};
