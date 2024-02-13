const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models/users");
// const cpf = require("../../helpers/cpf_generator");

let user;

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
      expect(res.body.error).toBe("O campo name é requirido");
    });
});

it("Não deve cadastrar um novo usuário sem cpf", () => {
  user.cpf = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo cpf é requirido");
    });
});

it("Não deve cadastrar um novo usuário sem email", () => {
  user.mail = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo mail é requirido");
    });
});

it("Não deve cadastrar um novo usuário sem senha", () => {
  user.passwd = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo passwd é requirido");
    });
});

it("Não deve cadastrar um novo usuário sem tipo de usuário", () => {
  user.seller = "";
  return request(app)
    .post("/user")
    .send(user)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("O campo seller é requirido");
    });
});

it("Não deve cadastrar um usuário com cpf repetido", () => {
  return db.create(user).then(() => {
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
  return db.create(user).then(() => {
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
  return db.create(user).then(() => {
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
  return db.create(user).then((r) => {
    return request(app)
      .get(`/user/${r.id}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(user.name);
        expect(res.body.cpf).toBe(user.cpf);
      });
  });
});

it("Deve remover um usuário cadastrado", () => {
  return db.create(user).then((r) => {
    return request(app)
      .put(`/user/${r.id}`)
      .send({ name: "new-name", passwd: "54321" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.modifiedCount).toBe(1);
      });
  });
});

it("Deve remover um usuário", () => {
  return db.create(user).then((r) => {
    return request(app)
      .delete(`/user/${r.id}`)
      .then((res) => {
        expect(res.status).toBe(204);
      });
  });
});
