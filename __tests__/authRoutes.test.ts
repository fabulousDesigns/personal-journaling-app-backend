import request from "supertest";
import express from "express";
import authRoute from "../src/routes/authRoute";
import { login } from "../src/services/user.service";
import { register } from "../src/services/user.service";

jest.mock("../src/services/user.service");

const app = express();
app.use(express.json());
app.use("/auth", authRoute);

describe("POST /auth/register", () => {
  it("should return 201 and user data when registration is successful", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
    };
    (register as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User registered successfully",
      user: mockUser,
    });
    expect(register).toHaveBeenCalledWith(
      "testuser",
      "test@example.com",
      "password123"
    );
  });

  it("should return 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ username: "testuser", email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Username, email, and password are required",
    });
  });

  it("should return 500 when an unexpected error occurs", async () => {
    (register as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    const response = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "An error occurred during registration",
    });
  });

  it("should return 409 when email is already in use", async () => {
    (register as jest.Mock).mockRejectedValue(
      new Error("Email already in use")
    );

    const response = await request(app).post("/auth/register").send({
      username: "testuser",
      email: "existing@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "Email already in use" });
  });
});

describe("POST /auth/login", () => {
  it("should return 200 and a token when login is successful", async () => {
    const mockToken = "mock.jwt.token";
    (login as jest.Mock).mockResolvedValue(mockToken);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: mockToken });
    expect(login).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("should return 401 when credentials are invalid", async () => {
    (login as jest.Mock).mockRejectedValue(
      new Error("Invalid email or password")
    );

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid email or password" });
  });

  it("should return 500 when an unexpected error occurs", async () => {
    (login as jest.Mock).mockRejectedValue(new Error("Unexpected error"));

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "An error occurred during login",
    });
  });

  it("should return 400 when email or password is missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Email and password are required",
    });
  });
});
