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
