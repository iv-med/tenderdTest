/**
 * Function to generate random datetime
 * @param from start date
 * @param to end date
 * @returns datetime value
 */
export const generateRandomDate = (from: Date, to: Date): Date => {
  return new Date(
    from.getTime() + Math.random() * (to.getTime() - from.getTime())
  );
};

/**
 * function for generating random bool value
 * @returns true or false
 */
export const randomBool = (): boolean => {
  return !!Math.round(Math.random());
};
