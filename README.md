## Devices Data Microservice Test Task

This microservices task:

- Could generate mock file with random dataset;
- Simulates dataset stream reading (from mock file) and process and normilize it;
- Validates the incoming data based on simple predefined rules.
- Sends alerts to console;
- If datapoint is valid then insert it to the Database (PostgreSQL as example);
- Has endpoint for getting datasets from db, get datapoint with id parameter, delete datapoint, truncate dataset, put datapoint and get last 10 data validations (from the log file).

### Built With

Main frameworks/libs which used in this project:

- ReactJS;
- ExpressJS;
- TypeORM;
- morgan;
- class-validator;
- crypto;
- jest.

## Configuration

App uses TypeORM for DB management. For provide your own credentials of your PostgreSQL connection (or change to another one provider) you have to go to "/configs/connection.ts" file and make changes here.
Note: no need to create table before app use, it will be created automaticaly in this configuration.
You can change server port in index.ts file (port variable)

## Running the Project

1. Clone repo to local directory (make sure Node.js v. 8 or later is installed)
2. Run
   ```sh
   npm install
   ```
   to install node dependencies
3. Run
    ```sh
        npm start
    ```
   to start the microservice (prod mode)
4. Run
    ```sh
        npm run dev
    ```
    to start the microservice (dev mode) 
5. Run
    ```sh
        npm run generateMock
    ```
    to generate random datasets (will be saved in 'mockData/data.json')

## Project functionality

### Dataset

There is random dataset file

```JSON
 {
        "id": 5586604,
        "deviceId": "d0f4ea29e",
        "datetime": "2023-10-20T00:33:09.111Z",
        "temp1": 90.22635413115486,
        "temp2": 62.950639957963716,
        "temp2Sensor": true,
        "humidity": 58.686698308170556,
        "humiditySensor": true,
        "presence": false,
        "rssi": -38,
        "upTime": 173230852

    }
```

| Name           | Description                 | DataType       | Required Field? | Constrains for DB                                                   |
| -------------- | --------------------------- | -------------- | --------------- | ------------------------------------------------------------------- |
| id             | datePointID                 | Number         | Yes             | Number                                                              |
| deviceId       | device number               | String         | Yes             | Size should be between 6 and 10                                     |
| datetime       | Date Time                   | Date \| number | Yes             | Could be number (datestamp) or string datetime                      |
| temp1          | Temperature 1 value         | Number         | No              | Should be rounded to the format like 23.43 (2 fraction digits)      |
| temp2          | Temperature 2 value         | Number         | No              | Should be rounded to the format like 23.43 (2 fraction digits)      |
| temp2Sensor    | If temp sensor 2 is enabled | Boolean        | No              | If temp 2 is exists and values is false then change to true         |
| humidity       | Humidity value              | Number         | No              | Should be rounded to the format like 23.43 (2 fraction digits)      |
| humiditySensor | If humidity is enabled      | Boolean        | No              | If hunidity value is exists and values is false then change to true |
| presence       | Presence value              | Boolean        | No              | True or False                                                       |
| rssi           | Wi-Fi signal value          | Number         | No              | Should be in range between 0 and -100                               |

When app is started it's start simulation datastream from the mock file (new data comes every 10 seconds).
By default mock file contains 100 datapoints, you can generate custom datapoint count with changing in the "deviceDataGenerator.ts" file.

App tries to parse and normalize datapoint, if data is valid then insert it in to DB.

Logs of normalizing adding to the "/logs/normalizing.log" file (each log item is a line with JSON string);

### Alarms

While data normalization we can get different types of alarms, such as big temperature alarm (between temp1 and temp2), cold temperature, hot temperature, outdated datetime (more than 24 hours left), low Wi-Fi signal etc.

### Routes

Microservice has the next routes:

| Route                                  | Method | Parameters     | Returns                                      |
| -------------------------------------- | ------ | -------------- | -------------------------------------------- |
| /api/devicesData                       | GET    |                | Data from the deviceData table               |
| /api/devicesData/:id                   | GET    | id: number     | Datapoint with requested id                  |
| /api/devicesData                       | DELETE |                | Table truncate results                       |
| /api/devicesData/:id                   | DELETE | id: number     | Datapoint deletion result with requested id  |
| /api/devicesData                       | PUT    | DevicesDataDTO | Inserted value                               |
| /api/devicesData/validationData/last10 | GET    |                | Last 10 line from the normalization log file |
