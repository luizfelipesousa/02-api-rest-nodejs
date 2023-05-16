import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

const databaseConfig = {
  pg: {
    client: env.DATABASE_CLIENT,
    connection: {
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      user: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      ssl: true,
    },
    searchPath: ["knex", "public"],
    migrations: {
      extension: "ts",
      directory: "./db/migrations",
    },
  },
  sqlite: {
    client: env.DATABASE_CLIENT,
    connection: { filename: env.DATABASE_URL },
    useNullAsDefault: true,
    migrations: {
      extension: "ts",
      directory: "./db/migrations",
    },
  },
};

export const config: Knex.Config = databaseConfig[env.DATABASE_CLIENT];

export const knex = setupKnex(config);
