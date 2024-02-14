const request = require("supertest");
const app = require("../src/app");

it("Deve rodar na porta 3000", () => {
  return request(app)
    .get("/")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Hello World!");
    });
});

it("Não deve permitir acesso a rota não existente", () => {
  return request(app)
    .get("/mockRoute")
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Rota não encontrada");
    });
});
