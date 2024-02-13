const router = require("express").Router();
const db = require("../models/users");

router
  .route("/")
  .post(async (req, res) => {
    const { name, cpf, mail, passwd, seller } = req.body;
    const cpfVerify = await db.findOne({ cpf });
    const dataVerify = await db.findOne({ $or: [{ cpf }, { mail }] });

    if (dataVerify) {
      if (dataVerify.cpf === cpf) {
        return res.status(400).json({ error: "CPF já cadastrado no sistema" });
      }
      if (dataVerify.mail === mail) {
        return res.status(400).json({ error: "Email á cadastrado no sistema" });
      }
    }

    const user = { name, cpf, mail, passwd, seller };

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
  .put(async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const result = await db.updateOne({ _id: id }, user);

    return res.status(200).json(result);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    await db.deleteOne({ _id: id });
    return res.status(204).json();
  });

module.exports = router;
