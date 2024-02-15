const accDb = require("../models/accounts");

module.exports = {
  createAccount: async (req, res) => {
    const { userId } = req.body;
    const newAccount = await accDb.create({ userId });

    return res.status(201).json(newAccount);
  },

  getAllAccounts: async (_req, res) => {
    const accountList = await accDb.find();
    return res.status(200).json(accountList);
  },

  getOneAccount: async (req, res) => {
    const { id } = req.params;
    const account = await accDb.findOne({ _id: id });
    return res.status(200).json(account);
  },

  updateOneAccount: async (req, res) => {
    const { balance } = req.body;
    return res.status(200).json({ userId: 1, balance });
  },

  deleteOneAccount: async (req, res) => {
    return res.status(204).json();
  },
};
