const request = require("supertest");
const app = require("../../src/app");
const userDb = require("../../src/models/users");

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

it("Deve retornar uma lista de contas", () => {
  return request(app)
    .get("/account")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("balance", 0);
    });
});

it("Deve retornar uma conta por id", () => {
  return request(app)
    .get("/account/1")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.userId).toBe(1);
    });
});

it("Deve alterar uma conta por id", () => {
  return request(app)
    .put("/account/1")
    .send({ balance: 100 })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.balance).toBe(100);
    });
});

it("Deve remover um conta por id", () => {
  return request(app)
    .delete("/account/1")
    .send({ id: 1 })
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
