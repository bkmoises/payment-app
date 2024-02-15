const accDb = require("../models/accounts");

module.exports = {
  createAccount: async (req, res) => {
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ error: "O campo userId é requerido" });
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
    const { id } = req.params;
    const { balance, status } = req.body;

    await accDb.updateOne({ _id: id }, { balance, status });
    return res.status(200).json({ message: "Conta alterada com sucesso" });
  },

  deleteOneAccount: async (req, res) => {
    const { id } = req.params;
    await accDb.deleteOne({ _id: id });
    return res.status(204).json();
  },
};
