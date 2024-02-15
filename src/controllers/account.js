module.exports = {
  createAccount: async (req, res) => {
    const { id } = req.body;

    return res.status(201).json({ userId: id, balance: 0 });
  },

  getAllAccounts: async (_req, res) => {
    return res.status(200).json([{ userId: 1, balance: 0 }]);
  },

  getOneAccount: async (req, res) => {
    return res.status(200).json({ userId: 1 });
  },

  updateOneAccount: async (req, res) => {
    const { balance } = req.body;
    return res.status(200).json({ userId: 1, balance });
  },

  deleteOneAccount: async (req, res) => {
    return res.status(204).json();
  },
};
