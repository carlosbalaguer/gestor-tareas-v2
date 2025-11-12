import { beforeEach, describe, expect, it } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp();

const getCookies = (response: request.Response): string[] => {
	const setCookie = response.headers["set-cookie"];
	if (!setCookie) return [];
	return Array.isArray(setCookie) ? setCookie : [setCookie];
};

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
			expect(response.body.data).toHaveProperty("user");
			expect(response.body.data.user).toHaveProperty("id");

			const cookies = getCookies(response);
			expect(cookies.length).toBeGreaterThan(0);
			expect(
				cookies.some((cookie) => cookie.includes("accessToken"))
			).toBe(true);
			expect(
				cookies.some((cookie) => cookie.includes("refreshToken"))
			).toBe(true);
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
				.expect(400);

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

		it("debe establecer cookies httpOnly", async () => {
			const response = await request(app)
				.post("/api/auth/register")
				.send({
					email: `jwt-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				})
				.expect(201);

			const cookies = getCookies(response);
			expect(cookies.length).toBeGreaterThan(0);

			expect(
				cookies.some(
					(cookie) =>
						cookie.includes("accessToken") &&
						cookie.includes("HttpOnly")
				)
			).toBe(true);
			expect(
				cookies.some(
					(cookie) =>
						cookie.includes("refreshToken") &&
						cookie.includes("HttpOnly")
				)
			).toBe(true);
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
			expect(response.body.data).toHaveProperty("user");
			expect(response.body.data.user.email).toBe(testEmail);

			const cookies = getCookies(response);
			expect(
				cookies.some((cookie) => cookie.includes("accessToken"))
			).toBe(true);
		});

		it("debe rechazar login con email inexistente", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: `noexiste-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				})
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar login con contraseña incorrecta", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send({
					email: testEmail,
					password: "XXXXXXXX",
				})
				.expect(400);

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

			const cookies1 = getCookies(response1);
			const cookies2 = getCookies(response2);

			const token1 = cookies1.find((c) => c.startsWith("accessToken="));
			const token2 = cookies2.find((c) => c.startsWith("accessToken="));

			expect(token1).not.toBe(token2);
		});
	});

	describe("POST /api/auth/logout", () => {
		it("debe hacer logout correctamente", async () => {
			const email = `logout-${Date.now()}@ejemplo.com`;

			const loginResponse = await request(app)
				.post("/api/auth/register")
				.send({ email, password: "Asdf1234" });

			const cookies = getCookies(loginResponse);

			const response = await request(app)
				.post("/api/auth/logout")
				.set("Cookie", cookies)
				.expect(200);

			expect(response.body.success).toBe(true);

			const setCookies = getCookies(response);
			expect(
				setCookies.some((cookie) => cookie.includes("accessToken=;"))
			).toBe(true);
		});
	});

	describe("POST /api/auth/refresh", () => {
		it("debe refrescar el access token correctamente", async () => {
			const email = `refresh-${Date.now()}@ejemplo.com`;

			const loginResponse = await request(app)
				.post("/api/auth/register")
				.send({ email, password: "Asdf1234" });

			const cookies = getCookies(loginResponse);

			const response = await request(app)
				.post("/api/auth/refresh")
				.set("Cookie", cookies)
				.expect(200);

			expect(response.body.success).toBe(true);

			const newCookies = getCookies(response);
			expect(
				newCookies.some((cookie) => cookie.includes("accessToken"))
			).toBe(true);
		});

		it("debe rechazar refresh sin cookie", async () => {
			const response = await request(app)
				.post("/api/auth/refresh")
				.expect(401);

			expect(response.body.success).toBe(false);
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

			const cookies = getCookies(registerResponse);

			const tasksResponse = await request(app)
				.get("/api/tasks")
				.set("Cookie", cookies)
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
				.set('Cookie', ['accessToken=token-invalido-fake'])
				.expect(500);

			expect(response.body.success).toBe(false);
		});
	});
});
