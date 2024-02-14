const db = require("../models/users");
const userService = require("../services/UserService");

module.exports = {
  createUser: async (req, res) => {
    const { name, cpf, mail, passwd, seller } = req.body;
    const user = { name, cpf, mail, passwd, seller };

    const { newUser, statusCode, error } = await userService.createUser(user);

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json(newUser);
  },

  getAllUsers: async (_req, res) => {
    const { users, statusCode, error } = await userService.getAllUsers();

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json(users);
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    const { user, statusCode, error } = await userService.getUser({ _id: id });

    if (!user) return res.status(statusCode).json({ error });

    return res.status(statusCode).json(user);
  },

  updateOneUser: async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    const { message, statusCode } = await userService.updateUser(
      { _id: id },
      user,
    );

    return res.status(statusCode).json({ message });
  },

  deleteOneUser: async (req, res) => {
    const { id } = req.params;
    const { statusCode, error } = await userService.deleteUser({ _id: id });

    if (error) return res.status(statusCode).json({ error });

    return res.status(statusCode).json();
  },
};
