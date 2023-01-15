import { config } from "dotenv";
config();
require("express-async-errors");
import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import { createDatabase } from "typeorm-extension";
import { AppDataSource } from "./data-source";
import { publicRouter } from "./routes/public";
import { privateRouter } from "./routes/private";
import { errorHandlerMiddleware } from "./errors/error-handler";

async function main() {
  await createDatabase({ ifNotExist: true });

  await AppDataSource.initialize();

  // create express app
  const app = express();
  app.use(bodyParser.json());

  app.use(publicRouter);
  app.use(privateRouter);
  app.use(errorHandlerMiddleware);

  // start express server
  app.listen(3000);

  console.log("Express server has started on port 3000.");
}

main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
