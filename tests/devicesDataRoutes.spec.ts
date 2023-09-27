import app from "../index";
import request from "supertest";

describe("GET /api/devicesData/", () => {
  it("Responds with json and status 200", async () => {
    const res = await request(app)
      .get("/api/devicesData/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("Returns bad request if something is wrong", async () => {
    const res = await request(app)
      .post("/api/devicesData/")
      .set("Accept", "application/json")
      .expect(404);
  });
});

describe("GET /api/devicesData/:id", () => {
  it("Responds with json and status 404 (ID not found)", async () => {
    const res = await request(app)
      .get("/api/devicesData/")
      .send("rwerw")
      .set("Accept", "application/json")
      .expect(404);
  });

  it("Responds with json and status 200 (ID is correct)", async () => {
    const res = await request(app)
      .get("/api/devicesData/")
      .send("49") //id should be exist in the DB
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("PUT /api/devicesData/", () => {
  it("Responds with json and status 400 (Bad request)", async () => {
    const res = await request(app)
      .put("/api/devicesData/")
      .send({ deviceId: "49", temp1: 32.54 }) // timestamp is missng!
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400);
  });

  it("Responds with json and status 200", async () => {
    const res = await request(app)
      .put("/api/devicesData/")
      .send({
        deviceId: "49",
        timestamp: "2020-01-01T00:00:00.000Z",
        temp1: 32.54,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("GET /api/devicesData/validationData/last10", () => {
  it("Responds with json and status 404 (ID not found)", async () => {
    const res = await request(app)
      .get("/api/devicesData/validationData/last10/31231")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404);
  });

  it("Responds with json and status 200 (route is OK)", async () => {
    const res = await request(app)
      .get("/api/devicesData/validationData/last10")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
