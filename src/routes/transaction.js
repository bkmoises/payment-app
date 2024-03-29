const router = require("express").Router();

const controller = require("../controllers/transaction");
const authorizationVerify = require("../middlewares/authorization");

// Rotas para manipulação de transações
router
  .route("/")
  .post(authorizationVerify, controller.makeTransfer) // Criar uma nova transação
  .get(controller.getAllTransactions); // Obter todas as transações

// Rotas para manipulação de transações por ID
router
  .route("/:id")
  .get(controller.getTransactionById) // Obter uma transação pelo ID
  .put(controller.revertTransaction); // Reverter uma transação pelo ID

module.exports = router;
