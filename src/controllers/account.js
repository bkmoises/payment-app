const accountService = require("../services/accountService");

module.exports = {
  createAccount: async (req, res) => {
    const { userId } = req.body;
    // Chama o serviço para criar uma conta
    const { account, statusCode, error } = await accountService.createAccount({
      _id: userId,
    });

    // Constrói a resposta com base no resultado da criação da conta
    return res.status(statusCode).json(account || { error });
  },

  getAllAccounts: async (_req, res) => {
    // Chama o serviço para obter a lista de todas as contas
    const { accountList, statusCode, error } =
      await accountService.getAllAccounts();

    // Constrói a resposta com base no resultado da criação da conta
    return res.status(statusCode).json(accountList || { error });
  },

  getOneAccount: async (req, res) => {
    const { id } = req.params;
    // Chama o serviço para obter uma conta
    const { account, statusCode, error } = await accountService.getOneAccount({
      _id: id,
    });

    // Constrói a resposta com base no resultado da criação da conta
    return res.status(statusCode).json(account || { error });
  },

  updateOneAccount: async (req, res) => {
    const { id } = req.params;
    const { balance, status } = req.body;

    // Chama o serviço para alterar uma conta
    const { message, statusCode, error } =
      await accountService.updateOneAccount({ _id: id }, { balance, status });

    // Constrói a resposta com base no resultado da criação da conta
    return res.status(statusCode).json(message ? { message } : { error });
  },

  deleteOneAccount: async (req, res) => {
    const { id } = req.params;
    // Chama o serviço para remover uma conta
    const { statusCode, error } = await accountService.deleteOneAccount({
      _id: id,
    });

    // Constrói a resposta com base no resultado da criação da conta
    return res.status(statusCode).json({ error });
  },
};
