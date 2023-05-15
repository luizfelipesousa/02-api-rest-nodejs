import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex:rollback");
    execSync("npm run knex:latest");
  });

  it("should be able to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "new title",
        amount: 1000,
        type: "debit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const transaction = await request(app.server).post("/transactions").send({
      title: "new title",
      amount: 1000,
      type: "credit",
    });

    const transactionsList = await request(app.server)
      .get("/transactions")
      .set("Cookie", transaction.get("Set-Cookie"))
      .expect(200);

    expect(transactionsList.body.transactions).toEqual([
      expect.objectContaining({
        title: "new title",
        amount: 1000,
      }),
    ]);
  });

  it("should be able to get a specific transaction by id", async () => {
    const response = await request(app.server).post("/transactions").send({
      title: "new title",
      amount: 1000,
      type: "credit",
    });

    const transactionsList = await request(app.server)
      .get("/transactions")
      .set("Cookie", response.get("Set-Cookie"));

    const { id } = transactionsList.body.transactions[0];

    const transaction = await request(app.server)
      .get(`/transactions/${id}`)
      .set("Cookie", response.get("Set-Cookie"))
      .expect(200);

    expect(transaction.body).toEqual(
      expect.objectContaining({
        id,
        title: "new title",
        amount: 1000,
      })
    );
  });

  it("should be able to get summary", async () => {
    const creditTransactions = await request(app.server)
      .post("/transactions")
      .send({ title: "credit", amount: 5000, type: "credit" });

    const debitTransactions = await request(app.server)
      .post("/transactions")
      .set("Cookie", creditTransactions.get("Set-Cookie"))
      .send({ title: "debit", amount: 2000, type: "debit" });

    const summary = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", creditTransactions.get("Set-Cookie"))
      .expect(200);

    expect(summary.body).toEqual({
      amount: 3000,
    });
  });
});
