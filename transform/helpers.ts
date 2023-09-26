/**
 * Function for converting milliseconds to seconds.
 * @param millisToSeconds - milliseconds
 * @returns seconds
 */
export const millisToSeconds = (millisToSeconds: number) => {
  return millisToSeconds / 1000;
};

/**
 * Function for round float values to DB standart.
 * @param num - float value
 * @param decimals - number of decimals to round to. Default is 2.
 * @returns rounded value
 */
export const round = (num: number, decimals: number = 2) => {
  num = num * Math.pow(10, decimals);
  num = Math.round(num);
  num = num / Math.pow(10, decimals);
  return num;
};
