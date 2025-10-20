import { beforeEach, describe, expect, it } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp();

describe("Tests de autenticación", () => {
	describe("POST /api/auth/register", () => {
		it("debe registrar un usuario correctamente", async () => {
			const uniqueEmail = `test-${Date.now()}@ejemplo.com`;

			const response = await request(app)
				.post("/api/auth/register")
				.send({
					email: uniqueEmail,
					password: "Asdf1234",
				})
				.expect(201);

			expect(response.body).toHaveProperty("success", true);
			expect(response.body.data).toHaveProperty("token");
			expect(response.body.data.user).toHaveProperty("id");
		});

		it("debe rechazar email duplicado", async () => {
			const email = `duplicado-${Date.now()}@ejemplo.com`;

			await request(app).post("/api/auth/register").send({
				email,
				password: "Asdf1234",
			});

			const response = await request(app)
				.post("/api/auth/register")
				.send({
					email,
					password: "Asdf1234",
				})
				.expect(500);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar registro sin email", async () => {
			const response = await request(app)
				.post("/api/auth/register")
				.send({
					password: "Asdf1234",
				})
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar registro sin contraseña", async () => {
			const response = await request(app)
				.post("/api/auth/register")
				.send({
					email: `test-${Date.now()}@ejemplo.com`,
				})
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it("debe generar un token JWT válido", async () => {
			const response = await request(app)
				.post("/api/auth/register")
				.send({
					email: `jwt-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				})
				.expect(201);

			const token = response.body.data.token;
			expect(token).toBeDefined();
		});
	});

	describe("POST /api/auth/login", () => {
		let testEmail: string;

		beforeEach(async () => {
			testEmail = `login-${Date.now()}@ejemplo.com`;
			await request(app).post("/api/auth/register").send({
				email: testEmail,
				password: "Asdf1234",
			});
		});

		it("debe hacer login con credenciales correctas", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: testEmail,
					password: "Asdf1234",
				})
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("token");
			expect(response.body.data.user.email).toBe(testEmail);
		});

		it("debe rechazar login con email inexistente", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: `noexiste-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				})
				.expect(500);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar login con contraseña incorrecta", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: testEmail,
					password: "XXXXXXXX",
				})
				.expect(500);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar login sin email", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					password: "Asdf1234",
				})
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar login sin contraseña", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: testEmail,
				})
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it("debe generar nuevo token en cada login", async () => {
			const response1 = await request(app).post("/api/auth/login").send({
				email: testEmail,
				password: "Asdf1234",
			});

			await new Promise((resolve) => setTimeout(resolve, 1000));

			const response2 = await request(app).post("/api/auth/login").send({
				email: testEmail,
				password: "Asdf1234",
			});

			expect(response1.body.data.token).not.toBe(
				response2.body.data.token
			);
		});
	});

	describe("Flujo completo de autenticación", () => {
		it("debe permitir usar el token para acceder a rutas protegidas", async () => {
			const email = `protected-${Date.now()}@ejemplo.com`;

			const registerResponse = await request(app)
				.post("/api/auth/register")
				.send({
					email,
					password: "Asdf1234",
				});

			const token = registerResponse.body.data.token;

			const tasksResponse = await request(app)
				.get("/api/tasks")
				.set("Authorization", `Bearer ${token}`)
				.expect(200);

			expect(tasksResponse.body.success).toBe(true);
			expect(Array.isArray(tasksResponse.body.data)).toBe(true);
		});

		it("debe rechazar acceso a rutas protegidas sin token", async () => {
			const response = await request(app).get("/api/tasks").expect(401);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar acceso con token inválido", async () => {
			const response = await request(app)
				.get("/api/tasks")
				.set("Authorization", "Bearer token-invalido-fake")
				.expect(500);

			expect(response.body.success).toBe(false);
		});
	});
});
