const db = require("../models/users");
const userService = require("../services/userService");

module.exports = {
  createUser: async (req, res) => {
    const { name, cpf, mail, passwd, seller } = req.body;
    const user = { name, cpf, mail, passwd, seller };

    const { data, statusCode, error } = await userService.createUser(user);

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json(data);
  },

  getAllUsers: async (_req, res) => {
    const { data, statusCode, error } = await userService.getAllUsers();

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json(data);
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    const { data, statusCode, error } = await userService.getUser(id);

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json(data);
  },

  updateOneUser: async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    const { message, statusCode, error } = await userService.updateUser(
      id,
      user,
    );

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json({ message });
  },

  deleteOneUser: async (req, res) => {
    const { id } = req.params;
    const { statusCode, error } = await userService.deleteUser(id);

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json();
  },
};
