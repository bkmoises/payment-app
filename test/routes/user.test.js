const request = require("supertest");
const app = require("../../src/app");

it("Deve criar um novo usuário", () => {
  const user = {
    userId: "1",
    name: "user-1",
    cpf: "123.456.789-10",
    mail: "mail@mail.com",
    passwd: "12345",
    seller: true,
  };

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

it("Deve retornar todos os usuários cadastrados", () => {
  return request(app)
    .get("/user")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("cpf", "123.456.789-10");
    });
});

it("Deve remover um usuário cadastrado", () => {
  return request(app)
    .put("/user/1")
    .send({ name: "new-name", passwd: "54321" })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.userId).toBe("1");
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
