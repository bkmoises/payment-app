const dbTrans = require("../models/transaction");
const dbUser = require("../models/users");
const dbAccount = require("../models/accounts");

module.exports = {
  getTransactions: async () => {
    const transactionList = await dbTrans.find();

    return {
      statusCode: 200,
      transactionList,
    };
  },
};
