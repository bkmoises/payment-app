const app = require("../../src/app");
const request = require("supertest");
const db = require("../../src/database/database");
const mockCpf = require("../helpers/cpfGenerator");

let user;

beforeEach(() => {
  user = {
    name: `user-${Date.now()}`,
    cpf: mockCpf(),
    mail: `${Date.now()}${Math.random()}@mail.com`,
    passwd: "12345",
    seller: true,
  };
});

it("Deve cadastrar um novo usuário", () => {
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.id).toBe(user.id);
      expect(res.body.name).toBe(user.name);
      expect(res.body.cpf).toBe(user.cpf);
    });
});

it("Não deve cadastrar um novo usuário sem nome", () => {
  user.name = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo name é requerido");
    });
});

it("Não deve cadastrar um novo usuário sem cpf", () => {
  user.cpf = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo cpf é requerido");
    });
});

it("Não deve cadastrar um novo usuário sem email", () => {
  user.mail = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo mail é requerido");
    });
});

it("Não deve cadastrar um novo usuário sem senha", () => {
  user.passwd = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo passwd é requerido");
    });
});

it("Não deve cadastrar um novo usuário sem tipo de usuário", () => {
  user.seller = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo seller é requerido");
    });
});

it("Não deve cadastrar um usuário com cpf repetido", () => {
  return db.createUser(user).then(() => {
    return request(app)
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("CPF já cadastrado no sistema");
      });
  });
});

it("Não deve cadastrar um usuário com email repetido", () => {
  return db.createUser(user).then(() => {
    user.cpf = mockCpf();
    return request(app)
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Email já cadastrado no sistema");
      });
  });
});

it("Deve retornar uma lista de usuários cadastrados", () => {
  return db.createUser(user).then(() => {
    return request(app)
      .get("/user")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("cpf");
      });
  });
});

it("Deve retornar um usuário cadastrado por id", () => {
  return db.createUser(user).then((r) => {
    return request(app)
      .get(`/user/${r.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(user.name);
        expect(res.body.cpf).toBe(user.cpf);
      });
  });
});

it("Não deve retornar um usuário caso o id não esteja cadastrado", () => {
  return request(app)
    .get("/user/65c41a9b4d91f0cd87899999")
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Usuário não encontrado");
    });
});

it("Deve atualizar os dados de um usuário", () => {
  return db.createUser(user).then((r) => {
    return request(app)
      .put(`/user/${r.id}`)
      .send({ name: "new-name", passwd: "54321" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe(`Usuário alterado com sucesso`);
      });
  });
});

it("Deve remover um usuário", () => {
  return db.createUser(user).then((r) => {
    return request(app)
      .delete(`/user/${r.id}`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
});

it("Deve retornar um erro caso não consiga resgatar os usuários", () => {
  const dbFindMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "findUser").mockImplementation(dbFindMock);

  return request(app)
    .get("/user")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao resgatar usuários");
    });
});

it("Deve retornar um erro caso o id fornecido seja invalido", () => {
  const dbFindOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "findUser").mockImplementation(dbFindOneMock);

  return request(app)
    .get("/user/123454321")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao resgatar usuário");
    });
});

it("Deve retornar um erro caso não consiga excluir um usuário", () => {
  const dbDeleteOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "deleteUser").mockImplementation(dbDeleteOneMock);

  return request(app)
    .delete("/user/321412321")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao excluir usuário");
    });
});

it("Deve retornar um erro caso não consiga atualizar os dados de um usuário", () => {
  const dbUpdateOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "updateUser").mockImplementation(dbUpdateOneMock);

  return request(app)
    .put("/user/123454321")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao alterar usuário");
    });
});

it("Deve retornar um erro caso não consiga cadastrar um usuário", () => {
  const dbCreateMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "createUser").mockImplementation(dbCreateMock);

  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao criar usuário");
    });
});
