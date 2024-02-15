const router = require("express").Router();
const accountController = require("../controllers/account");

// Rotas para manipulação de contas
router
  .route("/")
  .post(accountController.createAccount) // Criar uma nova conta
  .get(accountController.getAllAccounts); // Obter todas as contas

// Rotas para manipulação de contas por ID
router
  .route("/:id")
  .get(accountController.getOneAccount) // Obter uma conta pelo ID
  .put(accountController.updateOneAccount) // Atualizar uma conta pelo ID
  .delete(accountController.deleteOneAccount); // Excluir uma conta pelo ID

module.exports = router;
