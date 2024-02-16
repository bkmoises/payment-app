const request = require("supertest");
const app = require("../../src/app");
const dbUser = require("../../src/models/users");
const dbAccount = require("../../src/models/accounts");
const dbTrans = require("../../src/models/transaction");
const mockCpf = require("../helpers/cpfGenerator");

let users, payer, payee, payerAccount, payeeAccount;

beforeEach(async () => {
  users = [
    {
      name: `user-${Date.now()}`,
      cpf: mockCpf(),
      mail: `${Date.now()}@mail.com`,
      passwd: "12345",
      seller: false,
    },
    {
      name: `user-${Date.now()}`,
      cpf: mockCpf(),
      mail: `${Date.now()}${Math.random()}@mail.com`,
      passwd: "12345",
      seller: true,
    },
  ];

  payer = await dbUser.create(users[0]);
  payerAccount = await dbAccount.create({ userId: payer.id, balance: 100 });
  payee = await dbUser.create(users[1]);
  payeeAccount = await dbAccount.create({ userId: payee.id, balance: 100 });
});

it("Um usuário deve transferir dinheiro para um vendedor", () => {
  return request(app)
    .post("/transaction")
    .send({ payer: payer.id, payee: payee.id, value: 100 })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.value).toBe(100);
      expect(res.body.payer).toBe(payer.id);
      expect(res.body.payee).toBe(payee.id);
    });
});

it("Um usuário deve transferir dinheiro para outro usuário", () => {
  return dbUser.updateOne({ _id: payee.id }, { seller: false }).then(() => {
    return request(app)
      .post("/transaction")
      .send({ payer: payer.id, payee: payee.id, value: 100 })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.value).toBe(100);
        expect(res.body.payer).toBe(payer.id);
        expect(res.body.payee).toBe(payee.id);
      });
  });
});

it("um vendedor não deve transferir dinheiro para um usuário", () => {
  return dbUser.updateOne({ _id: payer.id }, { seller: true }).then(() => {
    return request(app)
      .post("/transaction")
      .send({ payer: payer.id, payee: payee.id, value: 100 })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Operação não permitida");
      });
  });
});

it("Deve retornar todas as transações", () => {
  return request(app)
    .get("/transaction")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("payer");
      expect(res.body[0]).toHaveProperty("payee");
      expect(res.body[0]).toHaveProperty("value");
    });
});

it("Deve retornar uma transação por ID", () => {
  return dbTrans
    .create({ payer: payer.id, payee: payee.id, value: 100 })
    .then((r) => {
      return request(app)
        .get(`/transaction/${r.id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body._id).toBe(r.id);
          expect(res.body.value).toBe(100);
        });
    });
});

it("Deve reverter uma transação", () => {
  return dbTrans
    .create({ payer: payer.id, payee: payee.id, value: 100 })
    .then((r) => {
      return request(app)
        .put(`/transaction/${r.id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.message).toBe("Transação revertida com sucesso");
        });
    });
});
