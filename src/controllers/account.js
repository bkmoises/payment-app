module.exports = {
  createAccount: async (req, res) => {
    const { id } = req.body;

    return res.status(201).json({ userId: id, balance: 0 });
  },
};
