/* main script */

import express from "express";

import devicesDataRouter from "./routes/devicesData";
import logger from "morgan";

import processDeviceData from "./analyze/index";
import { AppDataSource } from "./configs/connection";

const app: express.Application = express();
const port: number = 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect and init DB
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // start simulation data receiving processing
    processDeviceData();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
    console.log("Server closed");
    process.exit(1);
  });

app.use("/api/devicesData", devicesDataRouter);

// Handling '/' Request
app.get("/", (req, res) => {
  res.send("Hello from the Devices Data Microservice");
});

app.use((req, res, next) => {
  res.status(404).json({
    message:
      "Ohh you are lost, read the API documentation to find your way back home)",
  });
});

// Server setup
app.listen(port, () => {
  console.log(`Devices Data Microservice
         http://localhost:${port}/`);
});

export default app;
