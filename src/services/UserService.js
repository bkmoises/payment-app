const db = require("../models/users");

module.exports = {
  createUser: async (user) => {
    const { cpf, mail } = user;
    const requiredFields = Object.keys(user);

    for (const field of requiredFields) {
      if (!user[field]) {
        return {
          statusCode: 400,
          error: `O campo ${field} é requerido`,
        };
      }
    }

    const dataVerify = await db.findOne({ $or: [{ cpf }, { mail }] });

    if (dataVerify) {
      if (dataVerify.cpf === cpf) {
        return {
          statusCode: 400,
          error: "CPF já cadastrado no sistema",
        };
      }
      if (dataVerify.mail === mail) {
        return {
          statusCode: 400,
          error: "Email já cadastrado no sistema",
        };
      }
    }

    const newUser = await db.create(user);

    return {
      statusCode: 201,
      newUser,
    };
  },
};
