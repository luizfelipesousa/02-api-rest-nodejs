import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { knex } from "./database";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { checkIfSessionIdExists } from "./middlewares/check-if-sessionid-exists";

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: [checkIfSessionIdExists] }, async (req, reply) => {
    const { sessionId } = req.cookies;
    const transactions = await knex
      .table("transactions")
      .select("*")
      .where("session_id", sessionId);
    return { transactions };
  });

  app.get(
    "/:id",
    { preHandler: [checkIfSessionIdExists] },
    async (req, reply) => {
      const createSchemaBodyRequest = z.object({
        id: z.string().uuid(),
      });

      const { id } = createSchemaBodyRequest.parse(req.params);
      const { sessionId } = req.cookies;
      const transaction = await knex
        .table("transactions")
        .where({ id, session_id: sessionId })
        .first();

      return transaction
        ? reply.status(200).send(transaction)
        : reply.status(404).send("Transaction not found.");
    }
  );

  app.get(
    "/summary",
    { preHandler: [checkIfSessionIdExists] },
    async (req, reply) => {
      const { sessionId } = req.cookies;
      const summary = await knex
        .table("transactions")
        .sum("amount", { as: "amount" })
        .where("session_id", sessionId)
        .first();

      return summary;
    }
  );

  app.post("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const createSchemaBodyRequest = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["debit", "credit"]),
    });

    const { title, amount, type } = createSchemaBodyRequest.parse(req.body);

    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      });
    }

    await knex.table("transactions").insert({
      id: randomUUID(),
      title,
      amount: type == "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
