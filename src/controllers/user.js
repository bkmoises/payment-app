const db = require("../models/users");
const userService = require("../services/userService");

module.exports = {
  createUser: async (req, res) => {
    // Extrai os dados da requisição
    const { name, cpf, mail, passwd, seller } = req.body;
    const user = { name, cpf, mail, passwd, seller };

    // Chama o serviço para criar o usuário
    const { data, statusCode, error } = await userService.createUser(user);

    // Verifica se houve algum erro durante a criação do usuário
    if (error) return res.status(statusCode).json({ error });

    // Retorna o novo usuário criado
    return res.status(statusCode).json(data);
  },

  getAllUsers: async (_req, res) => {
    // Chama o serviço para obter todos os usuários
    const { data, statusCode, error } = await userService.getAllUsers();

    // Verifica se houve algum erro durante a obtenção dos usuários
    if (error) return res.status(statusCode).json({ error });

    // Retorna a lista de usuários
    return res.status(statusCode).json(data);
  },

  getUserById: async (req, res) => {
    // Extrai o ID do usuário da requisição
    const { id } = req.params;
    // Chama o serviço para obter o usuário pelo ID
    const { data, statusCode, error } = await userService.getUser({ _id: id });

    // Verifica se houve algum erro durante a obtenção do usuário
    if (error) return res.status(statusCode).json({ error });

    // Retorna o usuário
    return res.status(statusCode).json(data);
  },

  updateOneUser: async (req, res) => {
    // Extrai o ID do usuário da requisiçã
    const { id } = req.params;
    const user = req.body;

    // Chama o serviço para atualizar o usuário
    const { message, statusCode, error } = await userService.updateUser(
      { _id: id },
      user,
    );

    // Verifica se houve algum erro durante a atualização do usuário
    if (error) return res.status(statusCode).json({ error });

    // Retorna uma mensagem de sucesso
    return res.status(statusCode).json({ message });
  },

  deleteOneUser: async (req, res) => {
    // Extrai o ID do usuário da requisição
    const { id } = req.params;
    // Chama o serviço para deletar o usuário pelo ID
    const { statusCode, error } = await userService.deleteUser({ _id: id });

    // Verifica se houve algum erro durante a remoção do usuário
    if (error) return res.status(statusCode).json({ error });

    // Retorna uma resposta vazia com o status de not found
    return res.status(statusCode).json();
  },
};
