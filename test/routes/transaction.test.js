const request = require("supertest");
const app = require("../../src/app");
const dbUser = require("../../src/models/users");
const dbAccount = require("../../src/models/accounts");
const mockCpf = require("../helpers/cpfGenerator");

// let users, payer, payee, payerAccount, payeeAccount;
//
// beforeAll(async () => {
//   users = [
//     {
//       name: `user-${Date.now()}`,
//       cpf: mockCpf(),
//       mail: `${Date.now()}@mail.com`,
//       passwd: "12345",
//       seller: false,
//     },
//     {
//       name: `user-${Date.now()}`,
//       cpf: mockCpf(),
//       mail: `${Date.now()}${Math.random()}@mail.com`,
//       passwd: "12345",
//       seller: true,
//     },
//   ];
//
//   payer = await dbUser.create(users[0]);
//   payerAccount = await dbAccount.create({ userId: payer.id, balance: 100 });
//   payee = await dbUser.create(users[1]);
//   payeeAccount = await dbAccount.create({ userId: payee.id, balance: 100 });
// });
//
// it("Um usuário deve transferir dinheiro para outro usuário", () => {
//   const payload = {
//     value: 100.0,
//     payer: payerAccount.id,
//     payee: payeeAccount.id,
//   };
//
//   return request(app)
//     .post("/transaction")
//     .send(payload)
//     .then((r) => {
//       return dbAccount
//         .find({ _id: { $in: [payload.payer, payload.payee] } })
//         .then((res) => {
//           console.log(res[0]);
//           console.log(res[1]);
//         });
//     });
// });
//

it("Um usuário deve transferir dinheiro para outro usuário", () => {
  return request(app)
    .post("/transaction")
    .send({ value: 500 })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.value).toBe(500);
    });
});

it("Deve retornar todas as transações", () => {
  return request(app)
    .get("/transaction")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("transactionId");
    });
});
