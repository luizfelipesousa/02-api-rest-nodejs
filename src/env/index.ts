import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV == "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const schema = z.object({
  DATABASE_URL: z.string().nonempty(),
});

const _env = schema.safeParse(process.env);

if (_env.success == false) {
  console.error("Invalid environment variable!", _env.error.format());
  throw new Error("Invalid environment variable!");
}

export const env = _env.data;
