const axios = require("axios");
const request = require("supertest");
const app = require("../../src/app");
const dbUser = require("../../src/models/users");
const dbAccount = require("../../src/models/accounts");
const dbTrans = require("../../src/models/transaction");
const mockCpf = require("../helpers/cpfGenerator");
const autorizationVerify = require("../../src/middlewares/middleware");

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
    .send({ payer: payer.id, payee: payee.id, value: 50 })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.value).toBe(50);
      expect(res.body.payer).toBe(payer.id);
      expect(res.body.payee).toBe(payee.id);
    });
});

it("Um usuário deve transferir dinheiro para outro usuário", () => {
  return dbUser.updateOne({ _id: payee.id }, { seller: false }).then(() => {
    return request(app)
      .post("/transaction")
      .send({ payer: payer.id, payee: payee.id, value: 50 })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.value).toBe(50);
        expect(res.body.payer).toBe(payer.id);
        expect(res.body.payee).toBe(payee.id);
      });
  });
});

it("Um vendedor não deve transferir dinheiro para um usuário", () => {
  return dbUser.updateOne({ _id: payer.id }, { seller: true }).then(() => {
    return request(app)
      .post("/transaction")
      .send({ payer: payer.id, payee: payee.id, value: 50 })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Operação não permitida");
      });
  });
});

it("Deve verificar saldo antes de enviar dinheiro", () => {
  return request(app)
    .post("/transaction")
    .send({ payer: payer.id, payee: payee.id, value: 100.5 })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Saldo insuficiente");
    });
});

it("O saldo do pagador deve ser reduzido após uma transação", () => {
  return request(app)
    .post("/transaction")
    .send({ payer: payer.id, payee: payee.id, value: 50 })
    .then((res) => {
      return dbAccount.findOne({ userId: payer.id }).then((acc) => {
        expect(res.status).toBe(200);
        expect(acc.balance).toBe(50);
      });
    });
});

it("O saldo do recebidor deve ser acrescido após uma transação", () => {
  return request(app)
    .post("/transaction")
    .send({ payer: payer.id, payee: payee.id, value: 50 })
    .then((res) => {
      return dbAccount.findOne({ userId: payee.id }).then((acc) => {
        expect(res.status).toBe(200);
        expect(acc.balance).toBe(150);
      });
    });
});

it("Não deve concluir a transação se a API terceira não autorizar", () => {
  jest
    .spyOn(axios, "get")
    .mockResolvedValueOnce({ data: { message: "Não Autorizado" } });

  return request(app)
    .post("/transaction")
    .send({ payer: payer.id, payee: payee.id, value: 50 })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Transação não autorizada");
    });
});

it("Deve retornar todas as transações", () => {
  return dbTrans
    .create({ payer: payer.id, payee: payee.id, value: 50 })
    .then(() => {
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
});

it("Deve retornar uma transação por ID", () => {
  return dbTrans
    .create({ payer: payer.id, payee: payee.id, value: 50 })
    .then((r) => {
      return request(app)
        .get(`/transaction/${r.id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body._id).toBe(r.id);
          expect(res.body.value).toBe(50);
        });
    });
});

it("Deve retornar um erro caso a transação não exista", () => {
  return request(app)
    .get("/transaction/65cff9e39c5d8cef70212321")
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Transação não encontrada");
    });
});

it("Deve reverter uma transação", () => {
  return dbTrans
    .create({ payer: payer.id, payee: payee.id, value: 50 })
    .then((r) => {
      return dbTrans.findOne({ _id: r.id }).then((res) => {
        return request(app)
          .put(`/transaction/${r.id}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Transação revertida com sucesso");
          });
      });
    });
});

it("O valor da transação deve ser reconstituido no saldo do pagador e recebidor", async () => {
  const transaction = await request(app)
    .post("/transaction")
    .send({ payer: payer.id, payee: payee.id, value: 50 });
  await request(app).put(`/transaction/${transaction.body._id}`);

  const pr = await dbAccount.findOne({ userId: payer.id });
  const pe = await dbAccount.findOne({ userId: payer.id });

  expect(pr.balance).toBe(100);
  expect(pe.balance).toBe(100);
});

it("Deve retornar um erro caso não consiga resgatar uma transação", () => {
  const dbFindOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(dbTrans, "findOne").mockImplementation(dbFindOneMock);

  return request(app)
    .get("/transaction/123454321")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao resgatar transação");
    });
});

it("Deve retornar um erro caso não consiga reverter uma transação", () => {
  const dbUpdateOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(dbTrans, "updateOne").mockImplementation(dbUpdateOneMock);

  return request(app)
    .put("/transaction/123454311")
    .send({ reverted: true })
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao reverter a transação");
    });
});
