const request = require("supertest");
const app = require("../src/app");

it("Deve responder na raiz", () => {
  return request(app)
    .get("/")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Hello World!");
    });
});

it("Deve retornar um error quando tentar acessar uma rota inesistente", () => {
  return request(app)
    .get("/mockRoute")
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Rota não encontrada");
    });
});
