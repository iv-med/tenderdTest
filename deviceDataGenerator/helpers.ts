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

// Random Function to that returns 0 or 1 with
// equal probability
function rand50() {
  // rand() function will generate odd or even
  // number with equal probability. If rand()
  // generates odd number, the function will
  // return 1 else it will return 0.
  return Math.floor(Math.random() * 10) & 1;
}

// Random Function to that returns 1 with 75%
// probability and 0 with 25% probability using
// Bitwise OR
export const randomBool = (): boolean => {
  return !!(rand50() | rand50());
};
