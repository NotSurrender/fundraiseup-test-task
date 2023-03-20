import express from "express";
import { config } from "dotenv";
import kill from "kill-port";

function bootstrap() {
  const app = express();

  app.use(express.static("public"));

  const configResult = config();

  const port = Number(configResult.parsed?.PORT || 50000);

  app.listen(port, () => {
    console.log("Static server is running on port 50000");
  });

  process.on("SIGINT", function () {
    console.log("Caught interrupt signal");
    kill(port, "tcp").then(() => {
      console.log("Port killed");
      process.exit(0);
    });
  });

  return { app };
}

export const boot = bootstrap();
