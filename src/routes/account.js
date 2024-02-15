const router = require("express").Router();
const accountController = require("../controllers/account");

router
  .route("/")
  .post(accountController.createAccount)
  .get(accountController.getAllAccounts);

router
  .route("/:id")
  .get(accountController.getOneAccount)
  .put(accountController.updateOneAccount);
// .delete(accountController.deleteOneAccount)

module.exports = router;
