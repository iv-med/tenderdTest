// database configuration

import { DataSource } from "typeorm";
import { DevicesData } from "../entity/DevicesData.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "testDB",
  entities: [DevicesData],
  logging: true,
  synchronize: true,
});
