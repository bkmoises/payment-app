const router = require("express").Router();

router
  .route("/")
  .post((req, res) => {
    const user = req.body;
    return res.status(201).json(user);
  })

  .get((_req, res) => {
    const user = [
      {
        userId: "1",
        name: "user-1",
        cpf: "123.456.789-10",
        mail: "mail@mail.com",
        passwd: "12345",
        seller: true,
      },
    ];

    return res.status(200).json(user);
  });

router
  .route("/:id")
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
