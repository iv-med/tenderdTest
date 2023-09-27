import * as fs from "fs";
import { mockFileName, logNormalizingFileName } from "../configs/config";
import { dataPoint, normalizedDataPoint, errorType } from "../types";
import { normalizeDataPoint } from "../transform/normalyzedDataPoint";
import { insertDeviceData } from "../controllers/DevicesData.controller";
import { validateSync } from "class-validator";
import { DevicesDataDTO } from "../dto/DevicesData.dto";

const winston = require("winston");

//create loger
const normalizingLogger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: logNormalizingFileName }),
  ],
});

// analize, normalyze and insert data to the DB
export const analyzeDevicesData = () => {
  // load in data from json file
  const getThermoData: () => Promise<string> = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(mockFileName, "utf8", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  };

  const runAnalysis = async () => {
    try {
      let dataJSON: string = await getThermoData();
      let deviceData: dataPoint[] = JSON.parse(dataJSON);

      // exit analysis if no data
      if (deviceData.length === 0) {
        console.log(`\n--- There is no data to analyze. ---`);
        return;
      }

      // loop over generator function to asynchronously retrieve chunks of device data
      for await (const rawChunk of deviceData) {
        let readyForInsert: boolean = true;

        console.log("--- New DataPoint recieved ---");
        console.log(JSON.stringify(rawChunk, null, "\t"));
        const chunk: normalizedDataPoint = normalizeDataPoint(rawChunk);
        let errorCheck: errorType[] = [];
        let warningCheck: errorType[] = [];

        console.log("--- DataPoint normalized ---");

        console.log(JSON.stringify(chunk, null, "\t"));
        if (chunk.deviceId !== null) {
          const length: number = chunk.deviceId.length;
          if (length < 6 || length > 10) {
            let error: errorType = {
              errorMsg: "deviceId",
              message: "Should be 6< and <10",
            };
            errorCheck.push(error);
            readyForInsert = false;
          }
        } else {
          let error: errorType = { errorMsg: "deviceId", message: "Is Null" };
          readyForInsert = false;
          errorCheck.push(error);
        }

        if (chunk.timestamp !== undefined) {
          //if timestamp is older than 24 hours
          if (
            new Date(chunk.timestamp) < new Date(Date.now() - 60000 * 60 * 24)
          ) {
            let error: errorType = {
              errorMsg: "DateTime",
              message: "Very old",
              value: String(chunk.timestamp),
            };
            warningCheck.push(error);
          }
        } else {
          let error: errorType = { errorMsg: "DateTime", message: "Is Null" };
          errorCheck.push(error);
          readyForInsert = false;
        }

        if (chunk.temp1 !== null) {
          if (chunk.temp1 <= 15.0) {
            let error: errorType = {
              errorMsg: "temp1",
              message: "Cold",
              value: chunk.temp1,
            };
            warningCheck.push(error);
          } else if (chunk.temp1 >= 35.0) {
            let error: errorType = {
              errorMsg: "temp1",
              message: "Hot",
              value: chunk.temp1,
            };
            warningCheck.push(error);
          }
        } else {
          let error: errorType = { errorMsg: "temp1", message: "Is Null" };
          errorCheck.push(error);
        }

        if (chunk.temp2 !== null) {
          if (chunk.temp2 <= 15.0) {
            let error: errorType = {
              errorMsg: "temp2",
              message: "Cold",
              value: chunk.temp2,
            };
            warningCheck.push(error);
          } else if (chunk.temp2 >= 35.0) {
            let error: errorType = {
              errorMsg: "temp2",
              message: "Hot",
              value: chunk.temp2,
            };
            warningCheck.push(error);
          }
        } else {
          let error: errorType = { errorMsg: "temp2", message: "Is Null" };
          errorCheck.push(error);
        }

        if (chunk.temp2 && chunk.temp1) {
          let tempDiff: number = Math.abs(
            Math.abs(chunk.temp2) - Math.abs(chunk.temp1)
          );
          if (tempDiff > 10.0) {
            let error: errorType = {
              errorMsg: "temp1, temp2",
              message: "Difference",
              value: tempDiff,
            };
            warningCheck.push(error);
          }
        }

        if (chunk.humidity !== null) {
          //if timestamp is older than 24 hours
          if (chunk.humidity <= 0.0) {
            let error: errorType = {
              errorMsg: "temp2",
              message: "Cold (less 0.0)",
              value: chunk.humidity,
            };
            errorCheck.push(error);
          } else if (chunk.humidity > 100.0) {
            let error: errorType = {
              errorMsg: "humidity",
              message: "Wrong value (more 100)",
              value: chunk.humidity,
            };
            errorCheck.push(error);
          }
        } else {
          let error: errorType = { errorMsg: "humidity", message: "Is Null" };
          errorCheck.push(error);
        }

        if (chunk.presence === null) {
          let error: errorType = { errorMsg: "presence", message: "Is Null" };
          errorCheck.push(error);
        }

        if (chunk.rssi !== null) {
          if (chunk.rssi < -90 || chunk.rssi > -50) {
            let error: errorType = {
              errorMsg: "rssi",
              message: "Wrong value",
              value: chunk.rssi,
            };
            errorCheck.push(error);
          } else if (chunk.rssi < -80 && chunk.rssi > -90) {
            let error: errorType = {
              errorMsg: "rssi",
              message: "low signal",
              value: chunk.rssi,
            };
            warningCheck.push(error);
          }
        } else {
          let error: errorType = { errorMsg: "rssi", message: "Is Null" };
          errorCheck.push(error);
        }

        if (chunk.upTime === null) {
          let error: errorType = { errorMsg: "upTime", message: "Is Null" };
          errorCheck.push(error);
        }

        let errorCount: number = errorCheck.length;
        if (errorCount > 0) {
          console.error(
            "Errors found: " + JSON.stringify(errorCheck, null, "\t")
          );
        }

        if (warningCheck.length > 0) {
          console.error(
            "Warnings found: " + JSON.stringify(warningCheck, null, "\t")
          );
        }

        console.log("Ready for insert: " + String(readyForInsert));

        if (readyForInsert) {
          //insert data into DB
          let valForInsert = new DevicesDataDTO();
          valForInsert.deviceId = String(chunk.deviceId);
          valForInsert.timestamp = new Date(
            Date.parse(String(chunk.timestamp))
          );
          valForInsert.temp1 = Number(chunk.temp1);
          valForInsert.temp2 = Number(chunk.temp2);
          valForInsert.humidity = Number(chunk.humidity);
          valForInsert.presence = Boolean(chunk.presence);
          valForInsert.rssi = Number(chunk.rssi);
          valForInsert.uptime = Number(chunk.upTime);

          const resultValidate = validateSync(valForInsert);

          if (resultValidate.length > 0) {
            console.log("Validation failed. errors: ", resultValidate);
            throw resultValidate;
          } else {
            const resultQuery = await insertDeviceData(valForInsert);
            console.log("Inserting OK. results: ", resultQuery);
          }
        }

        normalizingLogger.log({
          level: errorCount > 0 ? "error" : "info",
          message: JSON.stringify({
            datetime: new Date().toLocaleString(),
            errorCheck,
            warningCheck,
            chunk,
          }),
        });
        console.log(`\n--- End of datapoing. ---`);

        await new Promise((r) => setTimeout(r, 10000));
      }
    } catch (err) {
      console.error(err);
    }
  };

  runAnalysis().then(() => {
    console.log(`Datastream ended...`);
  });
};
