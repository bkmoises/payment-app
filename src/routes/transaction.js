const router = require("express").Router();
const autorizationVerify = require("../middlewares/middleware");
const transactionController = require("../controllers/transaction");

router
  .route("/")
  .post(transactionController.makeTransfer)
  .get(transactionController.getAllTransactions);

router
  .route("/:id")
  .get(transactionController.getTransactionById)
  .put(transactionController.revertTransaction);

module.exports = router;
