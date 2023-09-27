import { randomBytes } from "crypto";
import { dataPoint } from "../types";
import { generateRandomDate, randomBool } from "./helpers";

import * as fs from "fs";
import {mockFileName} from "../configs/config";

/**
 * function for generating random data point
 * @returns dataPoint
 */
const generateDataPoint = () => {
  let dataPoint: dataPoint = {};

  dataPoint.id = Math.floor(Math.random() * 10000000);

  // is device id exist
  if (randomBool()) {
    // is device id is correct format (6 chars)
    if (randomBool()) {
      dataPoint.deviceId = randomBytes(8).toString("hex");
    } else {
      dataPoint.deviceId = randomBytes(Math.floor(Math.random() * 10)).toString(
        "hex"
      );
    }
  }

  // temp1 random
  if (randomBool()) {
    dataPoint.temp1 = Math.random() * 150;
  }

  // temp2 random
  if (randomBool()) {
    dataPoint.temp2 = Math.random() * 150;
  }

  dataPoint.temp2Sensor = randomBool();

  // humidity random
  if (randomBool()) {
    dataPoint.humidity = Math.random() * 110;
  }

  dataPoint.humiditySensor = randomBool();

  dataPoint.presence = randomBool();

  // random data
  if (randomBool()) {
    const randomDate = generateRandomDate(
      new Date(2023, 9, 25),
      new Date()
    ).toISOString();

    if (randomBool()) {
      dataPoint.datetime = randomDate;
    } else {
      //generate timestamp
      dataPoint.datetime = String(Date.parse(randomDate));
    }
  }

  // random wi-fi signal value
  if (randomBool()) {
    dataPoint.rssi = Math.floor(Math.random() * 99) - 99;
  }

  // random uptime signal value
  if (randomBool()) {
    dataPoint.upTime = Math.floor(Math.random() * 1000000000);
  }

  return dataPoint;
};

/**
 *  Function to generate a new datapoint and save it to the mockup file
 * @param volume datasets count
 * @returns true or fale
 */
export async function dataGenerator(volume: number) {
  try {
    let dataSetArray: dataPoint[] = [];
    for (let i = 0; i < volume; i++) {
      // await new Promise((r) => setTimeout(r, 1000));
      const dataSetItem = generateDataPoint();
      if (dataSetItem) dataSetArray.push(dataSetItem);
    }
    // save data
    fs.writeFileSync(mockFileName, JSON.stringify(dataSetArray, null, 4));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
