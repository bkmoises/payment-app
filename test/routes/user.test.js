const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models/users");
const cpf = require("../../helpers/cpf_generator");

let user;

beforeEach(() => {
  user = {
    name: `user-${Date.now()}`,
    cpf: cpf(),
    mail: `${Date.now()}@mail.com`,
    passwd: "12345",
    seller: true,
  };
});

it("Deve criar um novo usuário", () => {
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

it.only("Deve retornar todos os usuários cadastrados", () => {
  return db.create(user).then(() => {
    return request(app)
      .get("/user")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("cpf", "123.456.789-10");
      });
  });
});

it("Deve remover um usuário cadastrado", () => {
  return request(app)
    .put("/user/1")
    .send({ name: "new-name", passwd: "54321" })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("new-name");
      expect(res.body.passwd).toBe("54321");
    });
});

it("Deve remover um usuário", () => {
  return request(app)
    .delete("/user/1")
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
