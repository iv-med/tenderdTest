// script for generate mock data

import dataGenerator from "./deviceDataGenerator/index";

const dataSetCount: number = 100;

console.log(`Generating ${dataSetCount} datasets...`);
dataGenerator(dataSetCount);
console.log("Datasets generated!");
