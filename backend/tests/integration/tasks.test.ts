import { describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../src/app.js";

const app = createApp();

const getCookies = (response: request.Response): string[] => {
	const setCookie = response.headers["set-cookie"];
	if (!setCookie) return [];
	return Array.isArray(setCookie) ? setCookie : [setCookie];
};

describe("Tests de Tasks", () => {
	let cookies: string[];
	let userId: string;

	beforeEach(async () => {
		const response = await request(app)
			.post("/api/auth/register")
			.send({
				email: `taskuser-${Date.now()}@ejemplo.com`,
				password: "Asdf1234",
			});

		cookies = getCookies(response);
		userId = response.body.data?.user?.id;
	});

	describe("POST /api/tasks", () => {
		it("debe crear una tarea correctamente", async () => {
			const response = await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({
					title: "Nueva tarea",
					description: "Descripción de prueba",
				})
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.data.title).toBe("Nueva tarea");
			expect(response.body.data.description).toBe(
				"Descripción de prueba"
			);
			expect(response.body.data.userId).toBe(userId);
		});

		it("debe rechazar crear tarea sin autenticación", async () => {
			const response = await request(app)
				.post("/api/tasks")
				.send({
					title: "Nueva tarea",
					description: "Descripción",
				})
				.expect(401);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar crear tarea sin título", async () => {
			const response = await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({
					description: "Solo descripción",
				})
				.expect(400);

			expect(response.body.success).toBe(false);
		});

		it("debe crear tarea sin descripción", async () => {
			const response = await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({
					title: "Solo título",
				})
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.data.title).toBe("Solo título");
			expect(response.body.data.description).toBeNull();
		});
	});

	describe("GET /api/tasks", () => {
		beforeEach(async () => {
			await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({ title: "Tarea 1", description: "Desc 1" });

			await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({ title: "Tarea 2", description: "Desc 2" });
		});

		it("debe listar todas las tareas del usuario", async () => {
			const response = await request(app)
				.get("/api/tasks")
				.set("Cookie", cookies)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(Array.isArray(response.body.data)).toBe(true);
			expect(response.body.data.length).toBeGreaterThanOrEqual(2);
		});

		it("debe rechazar listar tareas sin autenticación", async () => {
			const response = await request(app).get("/api/tasks").expect(401);

			expect(response.body.success).toBe(false);
		});

		it("debe retornar solo las tareas del usuario autenticado", async () => {
			const otherUserResponse = await request(app)
				.post("/api/auth/register")
				.send({
					email: `otheruser-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				});

			const otherUserCookies = getCookies(otherUserResponse);

			await request(app)
				.post("/api/tasks")
				.set("Cookie", otherUserCookies)
				.send({ title: "Tarea de otro usuario" });

			const response = await request(app)
				.get("/api/tasks")
				.set("Cookie", cookies)
				.expect(200);

			expect(
				response.body.data.every((task: any) => task.userId === userId)
			).toBe(true);
		});
	});

	describe("GET /api/tasks/:taskId", () => {
		let taskId: number;

		beforeEach(async () => {
			const createResponse = await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({ title: "Tarea específica", description: "Desc" });

			taskId = createResponse.body.data.id;
		});

		it("debe obtener una tarea específica", async () => {
			const response = await request(app)
				.get(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.id).toBe(taskId);
			expect(response.body.data.title).toBe("Tarea específica");
		});

		it("debe rechazar obtener tarea sin autenticación", async () => {
			const response = await request(app)
				.get(`/api/tasks/${taskId}`)
				.expect(401);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar si la tarea no pertenece al usuario", async () => {
			const otherUserResponse = await request(app)
				.post("/api/auth/register")
				.send({
					email: `otrousuario2-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				});

			const otherUserCookies = getCookies(otherUserResponse);

			const response = await request(app)
				.get(`/api/tasks/${taskId}`)
				.set("Cookie", otherUserCookies)
				.expect(404);

			expect(response.body.success).toBe(false);
		});
	});

	describe("PUT /api/tasks/:taskId", () => {
		let taskId: number;

		beforeEach(async () => {
			const createResponse = await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({
					title: "Tarea original",
					description: "Desc original",
				});

			taskId = createResponse.body.data.id;
		});

		it("debe actualizar una tarea correctamente", async () => {
			const response = await request(app)
				.put(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.send({
					title: "Tarea actualizada",
					description: "Nueva descripción",
				})
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.title).toBe("Tarea actualizada");
			expect(response.body.data.description).toBe("Nueva descripción");
		});

		it("debe rechazar actualizar sin autenticación", async () => {
			const response = await request(app)
				.put(`/api/tasks/${taskId}`)
				.send({
					title: "Intento sin auth",
				})
				.expect(401);

			expect(response.body.success).toBe(false);
		});

		it("debe permitir actualizar solo la descripción", async () => {
			const response = await request(app)
				.put(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.send({
					description: "Nueva descripción",
				})
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.description).toBe("Nueva descripción");
		});

		it("debe rechazar actualizar tarea de otro usuario", async () => {
			const otherUserResponse = await request(app)
				.post("/api/auth/register")
				.send({
					email: `otrousuario3-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				});

			const otherUserCookies = getCookies(otherUserResponse);

			const response = await request(app)
				.put(`/api/tasks/${taskId}`)
				.set("Cookie", otherUserCookies)
				.send({
					title: "Intento de actualizar",
				})
				.expect(404);

			expect(response.body.success).toBe(false);
		});
	});

	describe("DELETE /api/tasks/:taskId", () => {
		let taskId: number;

		beforeEach(async () => {
			const createResponse = await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({
					title: "Tarea a eliminar",
					description: "Será eliminada",
				});

			taskId = createResponse.body.data.id;
		});

		it("debe eliminar una tarea correctamente", async () => {
			const response = await request(app)
				.delete(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.message).toBe(
				"Tarea eliminada correctamente"
			);

			await request(app)
				.get(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.expect(404);
		});

		it("debe rechazar eliminar sin autenticación", async () => {
			const response = await request(app)
				.delete(`/api/tasks/${taskId}`)
				.expect(401);

			expect(response.body.success).toBe(false);
		});

		it("debe rechazar eliminar tarea de otro usuario", async () => {
			const otherUserResponse = await request(app)
				.post("/api/auth/register")
				.send({
					email: `otheruser4-${Date.now()}@ejemplo.com`,
					password: "Asdf1234",
				});

			const otherUserCookies = getCookies(otherUserResponse);

			const response = await request(app)
				.delete(`/api/tasks/${taskId}`)
				.set("Cookie", otherUserCookies)
				.expect(404);

			expect(response.body.success).toBe(false);
		});
	});

	describe("Flujo completo CRUD", () => {
		it("debe permitir crear, listar, actualizar y eliminar tareas", async () => {
			const createResponse = await request(app)
				.post("/api/tasks")
				.set("Cookie", cookies)
				.send({
					title: "Tarea de flujo",
					description: "Prueba completa",
				});

			const taskId = createResponse.body.data.id;
			expect(createResponse.status).toBe(201);

			const listResponse = await request(app)
				.get("/api/tasks")
				.set("Cookie", cookies);

			expect(listResponse.body.data.length).toBeGreaterThanOrEqual(1);

			const getResponse = await request(app)
				.get(`/api/tasks/${taskId}`)
				.set("Cookie", cookies);

			expect(getResponse.body.data.title).toBe("Tarea de flujo");

			const updateResponse = await request(app)
				.put(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.send({
					title: "Tarea actualizada",
					description: "Nueva desc",
				});

			expect(updateResponse.body.data.title).toBe("Tarea actualizada");

			await request(app)
				.delete(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.expect(200);

			await request(app)
				.get(`/api/tasks/${taskId}`)
				.set("Cookie", cookies)
				.expect(404);
		});
	});
});
