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
import { logNormalizingFileName } from "../configs/config";

const readLastLines = require("read-last-lines");
const devicesDataRouter: express.Router = express.Router();

/**GET last 10 dataSets from the DB */
devicesDataRouter.get("/", function (req, res, next) {
  try {
    res.send("Hello from the Devices!");
  } catch (err) {
    console.error(err);
  }
});

/**
 * Get last 10 validation results (from the log file)
 */
devicesDataRouter.get("/lastValidation", function (req, res, next) {
  try {
    readLastLines.read(logNormalizingFileName, 10).then((lines: string) => {
      const trimStrings: string[] = lines.trim().split("\n");
      let linesParced: JSON[] = [];
      console.log("Last 10 datasets log: ");
      for (let lineRaw of trimStrings) {
        const line: JSON = JSON.parse(lineRaw);

        linesParced.push(line);
      }

      res.send(linesParced);
    });
  } catch (err) {
    console.error(err);
  }
});

export default devicesDataRouter;
