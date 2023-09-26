import dataGenerator from "./deviceDataGenerator/index";

const dataSetCount: number = 10;

console.log(`Generating ${dataSetCount} datasets...`);
dataGenerator(dataSetCount);
console.log("Datasets generated!");
