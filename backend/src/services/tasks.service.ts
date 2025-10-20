import { PrismaClient } from "@prisma/client";

export class TasksService {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async getTasksByUserId(userId: string) {
		if (!userId) throw new Error("User ID es obligatorio");

		const tasks = await this.prisma.task.findMany({
			where: { userId },
		});

		return tasks;
	}

	async getTaskById(taskId: number, userId: string) {
		if (!taskId) throw new Error("Task ID es obligatorio");
		if (!userId) throw new Error("User ID es obligatorio");

		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId)
			throw new Error("Tarea no encontrada o no autorizada");

		return task;
	}

	async createTask(
		userId: string,
		title: string,
		description: string | null
	) {
		if (!userId) throw new Error("User ID es obligatorio");
		if (!title) throw new Error("El título es obligatorio");

		const task = await this.prisma.task.create({
			data: {
				userId,
				title,
				description,
			},
		});

		return task;
	}

	async deleteTask(taskId: number, userId: string) {
		if (!taskId) throw new Error("Task ID es obligatorio");
		if (!userId) throw new Error("User ID es obligatorio");

		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId)
			throw new Error("Tarea no encontrada o no autorizada");

		await this.prisma.task.delete({
			where: { id: taskId },
		});

		return { message: "Tarea eliminada correctamente" };
	}

	async updateTask(
		taskId: number,
		userId: string,
		title: string,
		status: string,
		description: string | null
	) {
		if (!taskId) throw new Error("Task ID es obligatorio");
		if (!userId) throw new Error("User ID es obligatorio");
		if (!title) throw new Error("El título es obligatorio");

		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId)
			throw new Error("Tarea no encontrada o no autorizada");

		const updatedTask = await this.prisma.task.update({
			where: { id: taskId },
			data: {
				title,
				description,
				status,
			},
		});

		return updatedTask;
	}
}
