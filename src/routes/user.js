const router = require("express").Router();
const db = require("../models/users");

router
  .route("/")
  .post(async (req, res) => {
    const user = req.body;
    const result = await db.create(user);
    return res.status(201).json(result);
  })

  .get(async (_req, res) => {
    const result = await db.find();
    return res.status(200).json(result);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const result = await db.findOne({ _id: id });
    return res.status(200).json(result);
  })
  .put((req, res) => {
    const user = {
      userId: "1",
      name: "user-1",
      cpf: "123.456.789-10",
      mail: "mail@mail.com",
      passwd: "12345",
      seller: true,
    };

    user.name = req.body.name;
    user.passwd = req.body.passwd;

    return res.status(200).json(user);
  })

  .delete((req, res) => {
    return res.status(204).json();
  });

module.exports = router;
