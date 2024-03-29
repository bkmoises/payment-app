const axios = require("axios");
const app = require("../../src/app");
const request = require("supertest");
const db = require("../../src/database/database");
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

  payer = await db.createUser(users[0]);
  payerAccount = await db.createAccount(payer.id, 100);
  payee = await db.createUser(users[1]);
  payeeAccount = await db.createAccount(payee.id, 100);
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
  return db.updateUser(payee.id, { seller: false }).then(() => {
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
  return db.updateUser(payer.id, { seller: true }).then(() => {
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
      return db.findAccountByUserId(payer.id).then((acc) => {
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
      return db.findAccountByUserId(payee.id).then((acc) => {
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
  return db
    .createTransaction({ payer: payer.id, payee: payee.id, value: 50 })
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
  return db
    .createTransaction({ payer: payer.id, payee: payee.id, value: 50 })
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
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Transação não encontrada");
    });
});

it("Deve reverter uma transação", () => {
  return db
    .createTransaction({ payer: payer.id, payee: payee.id, value: 50 })
    .then((r) => {
      return db.findTransaction(r.id).then(() => {
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
  const transaction = await db.createTransaction({
    payer: payer.id,
    payee: payee.id,
    value: 50,
  });

  await request(app).put(`/transaction/${transaction.id}`);

  const payerAc = await db.findAccountByUserId(payer.id);
  const payeeAc = await db.findAccountByUserId(payee.id);

  expect(payerAc.balance).toBe(150);
  expect(payeeAc.balance).toBe(50);
});

it("Deve retornar um erro caso não consiga resgatar uma lista de transações", () => {
  const dbFindMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "findTransaction").mockImplementation(dbFindMock);

  return request(app)
    .get("/transaction")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao resgatar transações");
    });
});

it("Deve retornar um erro caso não consiga resgatar uma transação", () => {
  const dbFindOneMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "findTransaction").mockImplementation(dbFindOneMock);

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

  jest.spyOn(db, "revertTransaction").mockImplementation(dbUpdateOneMock);

  return request(app)
    .put("/transaction/123454311")
    .send({ reverted: true })
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao reverter transação");
    });
});

it("Deve retornar um erro caso não consiga realizar uma transação", () => {
  const dbCreateMock = jest.fn(() => {
    throw new Error();
  });

  jest.spyOn(db, "createTransaction").mockImplementation(dbCreateMock);

  return request(app)
    .post("/transaction")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Erro ao realizar transação");
    });
});
