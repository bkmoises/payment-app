const db = require("../models/users");

module.exports = {
  createUser: async (req, res) => {
    const { name, cpf, mail, passwd, seller } = req.body;
    const user = { name, cpf, mail, passwd, seller };
    const requiredFields = Object.keys(user);

    for (const field of requiredFields) {
      if (!user[field]) {
        return res.status(400).json({ error: `O campo ${field} é requerido` });
      }
    }

    const dataVerify = await db.findOne({ $or: [{ cpf }, { mail }] });

    if (dataVerify) {
      if (dataVerify.cpf === cpf) {
        return res.status(400).json({ error: "CPF já cadastrado no sistema" });
      }
      if (dataVerify.mail === mail) {
        return res
          .status(400)
          .json({ error: "Email já cadastrado no sistema" });
      }
    }

    const result = await db.create(user);

    return res.status(201).json(result);
  },

  getAllUsers: async (_req, res) => {
    const result = await db.find();
    return res.status(200).json(result);
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    const result = await db.findOne({ _id: id });
    return res.status(200).json(result);
  },

  updateOneUser: async (req, res) => {
    const { id } = req.params;
    const user = req.body;
    const result = await db.updateOne({ _id: id }, user);

    return res.status(200).json(result);
  },

  deleteOneUser: async (req, res) => {
    const { id } = req.params;
    await db.deleteOne({ _id: id });
    return res.status(204).json();
  },
};
