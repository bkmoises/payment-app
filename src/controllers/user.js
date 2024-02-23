const service = require("../services/user");

module.exports = {
  createUser: async (req, res) => {
    const { name, cpf, mail, passwd, seller } = req.body;

    const user = { name, cpf, mail, passwd, seller };

    const { data, statusCode, error } = await service.createUser(user);

    return res.status(statusCode).json(data || { error });
  },

  getAllUsers: async (_req, res) => {
    const { data, statusCode, error } = await service.getAllUsers();

    return res.status(statusCode).json(data || { error });
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    const { data, statusCode, error } = await service.getUser(id);

    return res.status(statusCode).json(data || { error });
  },

  updateOneUser: async (req, res) => {
    const user = req.body;
    const { id } = req.params;

    const { message, statusCode, error } = await service.updateUser(id, user);

    return res.status(statusCode).json(error ? { error } : { message });
  },

  deleteOneUser: async (req, res) => {
    const { id } = req.params;
    const { statusCode, error } = await service.deleteUser(id);

    return res.status(statusCode).json({ error });
  },
};
