import fastify from "fastify";
import { transactionRoutes } from "./routes";
import cookie from "@fastify/cookie";

export const app = fastify({});

app.register(cookie);

app.register(transactionRoutes, {
  prefix: "transactions",
});
