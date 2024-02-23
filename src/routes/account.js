const router = require("express").Router();
const controller = require("../controllers/account");

// Rotas para manipulação de contas
router
  .route("/")
  .post(controller.createAccount) // Criar uma nova conta
  .get(controller.getAllAccounts); // Obter todas as contas

// Rotas para manipulação de contas por ID
router
  .route("/:id")
  .get(controller.getOneAccount) // Obter uma conta pelo ID
  .put(controller.updateOneAccount) // Atualizar uma conta pelo ID
  .delete(controller.deleteOneAccount); // Excluir uma conta pelo ID

module.exports = router;
