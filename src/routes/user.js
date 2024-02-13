const router = require("express").Router();
const userController = require("../controllers/user");

router
  .route("/")
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateOneUser)
  .delete(userController.deleteOneUser);

module.exports = router;
