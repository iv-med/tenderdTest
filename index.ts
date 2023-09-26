/*Listens to a simulated sensor data stream (you may use mock data).
Validates the incoming data based on simple predefined rules (e.g., temperature range, proper
format, etc.).
Sends alerts (can be console logs for this exercise) when the data does not conform to the set
rules.
Logs the incoming data and its validation status.
Requirements:
Implement at least one endpoint that can be hit to retrieve the validation status of the last 10
data points.
Use any local database (e.g., PostgreSQL/MongoDB) to store the data.
Consider edge cases (e.g., missing data, corrupt data).
Include basic error handling.*/

import express from "express";

import devicesDataRouter from "./routes/devicesData";
import logger from "morgan";

import processDeviceData from "./analyze/index";


const app: express.Application = express();
const port: number = 3005;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/devicesData", devicesDataRouter);

// Handling '/' Request
app.get("/", (req, res) => {
  res.send("Hello from the Devices Data Microservice");
});

processDeviceData();

// Server setup
app.listen(port, () => {
  console.log(`Devices Data Microservice
         http://localhost:${port}/`);
});
