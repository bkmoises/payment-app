const router = require("express").Router();
const accountController = require("../controllers/account");

router.route("/").post(accountController.createAccount);

module.exports = router;
