const db = require("../models/users");
const userService = require("../services/UserService");

module.exports = {
  createUser: async (req, res) => {
    const { name, cpf, mail, passwd, seller } = req.body;
    const user = { name, cpf, mail, passwd, seller };

    const result = await userService.createUser(user);

    if (result.error)
      return res.status(result.statusCode).json({ error: result.error });

    return res.status(result.statusCode).json(result.newUser);
  },

  getAllUsers: async (_req, res) => {
    const result = await userService.getAllUsers();
    return res.status(result.statusCode).json(result.users);
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
