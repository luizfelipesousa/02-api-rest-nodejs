import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV == "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]),
  DATABASE_URL: z.string().nonempty(),
  PORT: z.coerce.number().default(3333),
});

const _env = schema.safeParse(process.env);

if (_env.success == false) {
  console.error("Invalid environment variable!", _env.error.format());
  throw new Error("Invalid environment variable!");
}

export const env = _env.data;
