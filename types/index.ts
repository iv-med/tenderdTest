// datapoints types

export type dataPoint = {
  id?: number;
  deviceId?: string;
  temp1?: number;
  temp2?: number;
  temp2Sensor?: boolean;
  humidity?: number;
  humiditySensor?: boolean;
  presence?: boolean;
  datetime?: string;
  rssi?: number;
  upTime?: number;
};

export type normalizedDataPoint = {
  normalizedID: number;
  id?: number;
  deviceId: string | null;
  timestamp?: Date;
  temp1: number | null;
  temp2: number | null;
  temp2Sensor: boolean;
  humidity: number | null;
  humiditySensor: boolean;
  presence: boolean | null;
  rssi: number | null;
  upTime: number | null;
};

export type errorType = {
  errorMsg: string;
  message: string;
  value?: string | number;
};
