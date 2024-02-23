const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/database/database");
const mockCpf = require("../helpers/cpfGenerator");

let user;
let userId;

beforeEach(() => {
  user = {
    name: `user-${Date.now()}`,
    cpf: mockCpf(),
    mail: `${Date.now()}${Math.random()}@mail.com`,
    passwd: "12345",
    seller: true,
  };

  userId = Date.now().toString();
});

it("Deve criar uma nova conta", () => {
  return db.createUser(user).then((r) => {
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
  return db.createUser(user).then((r) => {
    return db.createAccount(r.id).then((acc) => {
      return request(app)
        .post("/account")
        .send({ userId: r.id })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.error).toBe("Usuário já cadastrado no sistema");
        });
    });
  });
});

it("Não deve criar uam conta para usuário inativo", () => {
  user.status = false;
  return db.createUser(user).then((r) => {
    return request(app)
      .post("/account")
      .send({ userId: r.id })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Usuário inativo");
      });
  });
});

it("Não deve criar uma conta para usuário um usuário não cadastrado", () => {
  return request(app)
    .post("/account")
    .send({ userId: "65cd5d0fa30a48596f000000" })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Usuário não encontrado");
    });
});

it("Deve retornar uma lista de contas", () => {
  return db.createAccount(Date.now()).then(() => {
    return request(app)
      .get("/account")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("balance");
      });
  });
});

it("Deve retornar uma conta por id", () => {
  return db.createAccount(userId).then((r) => {
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
  return db.createAccount(userId).then((r) => {
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
  return db.createAccount(userId).then((r) => {
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

  jest.spyOn(db, "createAccount").mockImplementation(dbCreateMock);

  return db.createUser(user).then((r) => {
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

  jest.spyOn(db, "findAccount").mockImplementation(dbFindMock);

  return request(app)
    .get("/account")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao resgatar contas");
    });
});

it("Deve retornar um erro caso não consiga recuperar uma conta", () => {
  const dbFindOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "findAccount").mockImplementation(dbFindOneMock);

  return request(app)
    .get("/account/65cd5d0fa30a48596f000000")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao resgatar conta");
    });
});

it("Deve retornar um erro caso não consiga atualizar uma conta", () => {
  const dbUpdateOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "updateAccount").mockImplementation(dbUpdateOneMock);

  return request(app)
    .put("/account/65cd5d0fa30a48596f000000")
    .send({ balance: 100, status: false })
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao alterar conta");
    });
});

it("Deve retornar um erro caso não consiga remover uma conta", () => {
  const dbDeleteOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "deleteAccount").mockImplementation(dbDeleteOneMock);

  return request(app)
    .delete("/account/65cd5d0fa30a48596f000000")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao excluir conta");
    });
});
