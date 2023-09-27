/* /api/devicesData/* router */

import express from "express";
import { logNormalizingFileName } from "../configs/config";
import {
  getDeviceData,
  getAllDevicesData,
  insertDeviceData,
  deleteDeviceData,
  deleteAllDeviceData,
} from "../controllers/DevicesData.controller";
import { validateSync } from "class-validator";
import { DevicesDataDTO } from "../dto/DevicesData.dto";

const readLastLines = require("read-last-lines");
const devicesDataRouter: express.Router = express.Router();

devicesDataRouter.put("/", async (req, res) => {
  try {
    let valForInsert = new DevicesDataDTO();
    valForInsert.deviceId = req.body.deviceId;
    valForInsert.timestamp = req.body.timestamp;
    valForInsert.temp1 = req.body.temp1;
    valForInsert.temp2 = req.body.temp2;
    valForInsert.humidity = req.body.humidity;
    valForInsert.presence = req.body.presence;
    valForInsert.rssi = req.body.rssi;
    valForInsert.uptime = req.body.uptime;

    const resultValidate = validateSync(valForInsert);
    if (resultValidate.length > 0) {
      console.log("Validation failed. errors: ", resultValidate);
      throw resultValidate;
    } else {
      const resultQuery = await insertDeviceData(valForInsert);
      console.log("Inserting OK. results: ", resultQuery);
      res.status(200).send({ status: "OK", message: resultQuery });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).send({ status: "Error", message: error });
  }
});

/**GET dataSets from the DB */
devicesDataRouter.get("/", async (req, res) => {
  try {
    const resultQuery = await getAllDevicesData();
    res.status(200).send({ status: "OK", message: resultQuery });
  } catch (err) {
    console.log("error: ", err);
    res.status(400).send({ status: "Error", message: err });
  }
});

/**GET dataSet from the DB with id */
devicesDataRouter.get("/:id", async (req, res) => {
  try {
    const resultQuery = await getDeviceData(Number(req.params.id));
    res.status(resultQuery !== null ? 200 : 404).send({
      status: resultQuery !== null ? "OK" : "Not found!",
      message: resultQuery,
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(400).send({ status: "Error", message: err });
  }
});

/** Delete dataPoint from the DB with id */
devicesDataRouter.delete("/:id", async (req, res) => {
  try {
    const resultQuery = await deleteDeviceData(Number(req.params.id));
    res.status(200).send({ status: "OK", message: resultQuery });
  } catch (err) {
    console.log("error: ", err);
    res.status(400).send({ status: "Error", message: err });
  }
});

/** Truncate dataSet from the DB with id */
devicesDataRouter.delete("/", async (req, res) => {
  try {
    const resultQuery = await deleteAllDeviceData();
    res.status(200).send({ status: "OK", message: resultQuery });
  } catch (err) {
    console.log("error: ", err);
    res.status(400).send({ status: "Error", message: err });
  }
});

/**
 * Get last 10 validation results (from the log file)
 */
devicesDataRouter.get("/validationData/last10", function (req, res, next) {
  try {
    readLastLines.read(logNormalizingFileName, 10).then((lines: string) => {
      const trimStrings: string[] = lines.trim().split("\n");
      let linesParced: JSON[] = [];
      console.log("Last 10 datasets log: ");
      for (let lineRaw of trimStrings) {
        const line: JSON = JSON.parse(lineRaw);

        linesParced.push(line);
      }
      res.status(200).send({ status: "OK", message: linesParced });
    });
  } catch (err) {
    console.log("error: ", err);
    res.status(400).send({ status: "Error", message: err });
  }
});

export default devicesDataRouter;
