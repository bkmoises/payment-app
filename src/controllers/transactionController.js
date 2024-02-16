module.exports = {
  makeTransfer: async (req, res) => {
    const { value } = req.body;

    return res
      .status(200)
      .json({ transactionId: 1, payer: 1, payee: 1, value });
  },
};
