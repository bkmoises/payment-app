const router = require("express").Router();

const controller = require("../controllers/user");

// Rotas para manipulação de usuários
router
  .route("/")
  .post(controller.createUser) // Criar um novo usuário
  .get(controller.getAllUsers); // Obter todos os usuários

// Rotas para manipulação de usuários por ID
router
  .route("/:id")
  .get(controller.getUserById) // Obter um usuário pelo ID
  .put(controller.updateOneUser) // Atualizar um usuário pelo ID
  .delete(controller.deleteOneUser); // Excluir um usuário pelo ID

module.exports = router;
