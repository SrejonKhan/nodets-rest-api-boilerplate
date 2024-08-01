import request from "supertest";
import { server } from "../../src/server";

describe("Auth Integration Test", () => {
  test("POST /api/v1/auth/signup", async () => {
    const response = await request(server)
      .post("/api/v1/auth/signup")
      .send({ email: "hello@example.com", password: "123456" })
      .expect(`Content-Type`, /json/)
      .expect(200);

    expect(response.body.email).toEqual("hello@example.com");
  });
  describe("POST /api/v1/auth/signin", () => {});
  describe("GET /api/v1/auth/whoami", () => {});
  describe("POST /api/v1/auth/change-password", () => {});
  describe("POST /api/v1/auth/refresh", () => {});
});
