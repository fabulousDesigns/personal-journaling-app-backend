import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import protectedRoutes from "../src/routes/protectedRoutes";

const app = express();
app.use(express.json());
app.use("/api/protected", protectedRoutes);

const JWT_SECRET: string = process.env.JWT_SECRET || "secret";

describe("Protected Routes", () => {
  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/api/protected");
    expect(response.status).toBe(401);
  });

  it("should return 403 if an invalid token is provided", async () => {
    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", "Bearer invalidtoken");
    expect(response.status).toBe(403);
  });

  it("should return 200 and protected data if a valid token is provided", async () => {
    const token = jwt.sign({ userId: 1 }, JWT_SECRET);
    const response = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "This is protected data!" });
  });
});
