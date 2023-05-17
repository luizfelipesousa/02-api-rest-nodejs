import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT }).then(() => {
  return console.log("HTTP Server is up and running...");
});
