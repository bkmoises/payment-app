const router = require("express").Router();
const transactionController = require("../controllers/transactionController.js");

router
  .route("/")
  .post(transactionController.makeTransfer)
  .get(transactionController.getAllTransactions);

module.exports = router;
