import { dataPoint, normalizedDataPoint } from "../types";
import { millisToSeconds, round } from "./helpers";

export const normalizeDataPoint: (chunk: dataPoint) => normalizedDataPoint = (
  chunk: dataPoint
) => {
  return {
    normalizedID: Math.floor(Math.random() * 10000000),
    id: chunk.id,
    deviceId: chunk.deviceId ? chunk.deviceId.toUpperCase() : null,
    timestamp:
      typeof chunk.datetime === "string"
        ? Date.parse(chunk.datetime)
        : chunk.datetime ?? null,
    temp1: chunk.temp1 ? round(chunk.temp1) : null,
    temp2: chunk.temp2 ? round(chunk.temp2) : null,
    temp2Sensor: chunk.temp2 ? true : false,
    humidity: chunk.humidity ? round(chunk.humidity) : null,
    humiditySensor: chunk.humidity ? true : false,
    presence: chunk.presence ?? null,
    rssi: chunk.rssi ?? null,
    upTime: chunk.upTime ? Math.floor(millisToSeconds(chunk.upTime)) : null,
  };
};
