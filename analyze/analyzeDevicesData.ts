import * as fs from "fs";
import { mockFileName, logNormalizingFileName } from "../configs/config";
import { dataPoint, normalizedDataPoint, errorType } from "../types";
import { normalizeDataPoint } from "../transform/normalyzedDataPoint";
const winston = require("winston");

const normalizingLogger = winston.createLogger({
  level: "info",
  //format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: logNormalizingFileName }),
  ],
});

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
      let readyForInsert: boolean = true;

      // exit analysis if no data
      if (deviceData.length === 0) {
        console.log(`\n--- There is no data to analyze. ---`);
        return;
      }

      // loop over generator function to asynchronously retrieve chunks of device data
      for await (const rawChunk of deviceData) {
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
              message: "Should be >6 and <10",
            };
            errorCheck.push(error);
            readyForInsert = false;
          }
        } else {
          let error: errorType = { errorMsg: "deviceId", message: "Is Null" };
          readyForInsert = false;
          errorCheck.push(error);
        }

        if (chunk.timestamp !== null) {
          //if timestamp is older than 24 hours
          if (chunk.timestamp < Date.now() - 60000 * 60 * 24) {
            let error: errorType = {
              errorMsg: "DateTime",
              message: "Very old",
              value: chunk.timestamp,
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
          let tempDiff: number = chunk.temp2 - chunk.temp1;
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
            "%cErrors found: " + JSON.stringify(errorCheck, null, "\t"),
            "color: red"
          );
        }

        if (warningCheck.length > 0) {
          console.error(
            "Warnings found: " + JSON.stringify(warningCheck, null, "\t")
          );
        }

        normalizingLogger.log({
          level: errorCount > 0 ? "error" : "info",
          message: JSON.stringify({datetime: new Date().toLocaleString(), errorCheck, warningCheck, chunk }),
        });

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
