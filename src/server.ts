import { app } from "./app";
import { env } from "./env";

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  return console.log("HTTP Server is up and running...");
});
