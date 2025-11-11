import { PrismaClient } from "@prisma/client";
import createHttpError from "http-errors";

export class TasksService {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async getTasksByUserId(userId: string) {
		const tasks = await this.prisma.task.findMany({
			where: { userId },
		});

		return tasks;
	}

	async getTaskById(taskId: number, userId: string) {
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId)
			throw createHttpError(404, "Tarea no encontrada o no autorizada");

		return task;
	}

	async createTask(
		userId: string,
		title: string,
		description: string | null
	) {
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
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId)
			throw createHttpError(404, "Tarea no encontrada o no autorizada");

		await this.prisma.task.delete({
			where: { id: taskId },
		});

		return { message: "Tarea eliminada correctamente" };
	}

	async updateTask(
		taskId: number,
		userId: string,
		title?: string,
		status?: string,
		description?: string
	) {
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId)
			throw createHttpError(404, "Tarea no encontrada o no autorizada");

		const updateData: any = {};
		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (status !== undefined) updateData.status = status;

		const updatedTask = await this.prisma.task.update({
			where: { id: taskId },
			data: updateData,
		});

		return updatedTask;
	}
}
