import { DataSource } from "typeorm";
import { User } from "./entity/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
