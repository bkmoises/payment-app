const request = require("supertest");
const app = require("../../src/app");
const userDb = require("../../src/models/users");
const accDb = require("../../src/models/accounts");
const account = require("../../src/controllers/account");

let user;
let userId;

const mockCpf = () => {
  const randomNumber = () => Math.floor(Math.random() * 10);

  const cpfArray = Array.from({ length: 9 }, randomNumber);

  const d1 =
    cpfArray.reduce((acc, digit, index) => acc + digit * (index + 1), 0) % 11;
  cpfArray.push(d1 < 10 ? d1 : 0);

  const d2 =
    cpfArray.reduce((acc, digit, index) => acc + digit * index, 0) % 11;
  cpfArray.push(d2 < 10 ? d2 : 0);

  const cpf = cpfArray
    .join("")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  return cpf;
};

beforeEach(() => {
  user = {
    name: `user-${Date.now()}`,
    cpf: mockCpf(),
    mail: `${Date.now()}@mail.com`,
    passwd: "12345",
    seller: true,
  };

  userId = Date.now().toString();
});

it("Deve criar uma nova conta", () => {
  return userDb.create(user).then((r) => {
    return request(app)
      .post("/account")
      .send({ userId: r.id })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.userId).toBe(r.id);
        expect(res.body).toHaveProperty("balance", 0);
      });
  });
});

it("Não deve criar uma conta sem userId", () => {
  return request(app)
    .post("/account")
    .send({ userId: "" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo userId é requerido");
    });
});

it("Não deve criar uma conta com userId repetido", () => {
  return userDb.create(user).then((r) => {
    return accDb.create({ userId: r.id }).then((acc) => {
      return request(app)
        .post("/account")
        .send({ userId: r.id })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe("Este usuário já possui uma conta");
        });
    });
  });
});

it("Não deve criar uma conta para usuário um usuário não cadastrado", () => {
  return request(app)
    .post("/account")
    .send({ userId: "65cd5d0fa30a48596f000000" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O usuário informado não existe");
    });
});

it("Deve retornar uma lista de contas", () => {
  return accDb.create({ userId: Date.now() }).then(() => {
    return request(app)
      .get("/account")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("balance", 0);
      });
  });
});

it("Deve retornar uma conta por id", () => {
  return accDb.create({ userId }).then((r) => {
    return request(app)
      .get(`/account/${r.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.userId).toBe(userId);
      });
  });
});

it("Não deve retornar uma conta caso o ID não exista no banco", () => {
  return request(app)
    .get("/account/65cd5d0fa30a48596f000000")
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Conta não encontrada");
    });
});

it("Deve alterar uma conta por id", () => {
  return accDb.create({ userId }).then((r) => {
    return request(app)
      .put(`/account/${r.id}`)
      .send({ balance: 100 })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Conta alterada com sucesso");
      });
  });
});

it("Deve remover um conta por id", () => {
  return accDb.create({ userId }).then((r) => {
    return request(app)
      .delete(`/account/${r.id}`)
      .then((res) => {
        expect(res.status).toBe(204);
        expect(res.body).not.toHaveProperty("error");
      });
  });
});

it("Deve retornar um erro caso não consiga criar uma conta", () => {
  const dbCreateMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(accDb, "create").mockImplementation(dbCreateMock);

  return userDb.create(user).then((r) => {
    return request(app)
      .post("/account")
      .send({ userId: r.id })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Erro ao criar conta");
      });
  });
});

it("Deve retornar um erro caso não consiga recuperar a lista de contas", () => {
  const dbFindMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(accDb, "find").mockImplementation(dbFindMock);

  return request(app)
    .get("/account")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao recuperar contas");
    });
});

it("Deve retornar um erro caso não consiga recuperar uma conta", () => {
  const dbFindOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(accDb, "findOne").mockImplementation(dbFindOneMock);

  return request(app)
    .get("/account/65cd5d0fa30a48596f000000")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao recuperar conta");
    });
});

it("Deve retornar um erro caso não consiga ataulizar uma conta", () => {
  const dbUpdateOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(accDb, "updateOne").mockImplementation(dbUpdateOneMock);

  return request(app)
    .put("/account/65cd5d0fa30a48596f000000")
    .send({ balance: 100, status: false })
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao atualizar dados da conta");
    });
});

it("Deve retornar um erro caso não consiga remover uma conta", () => {
  const dbDeleteOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(accDb, "deleteOne").mockImplementation(dbDeleteOneMock);

  return request(app)
    .delete("/account/65cd5d0fa30a48596f000000")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao remover conta");
    });
});
