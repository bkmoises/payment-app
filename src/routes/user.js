const router = require("express").Router();
const userController = require("../controllers/user");

// Rotas para manipulação de usuários
router
  .route("/")
  .post(userController.createUser) // Criar um novo usuário
  .get(userController.getAllUsers); // Obter todos os usuários

// Rotas para manipulação de usuários por ID
router
  .route("/:id")
  .get(userController.getUserById) // Obter um usuário pelo ID
  .put(userController.updateOneUser) // Atualizar um usuário pelo ID
  .delete(userController.deleteOneUser); // Excluir um usuário pelo ID

module.exports = router;
