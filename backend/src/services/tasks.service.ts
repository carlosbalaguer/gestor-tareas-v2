import { PrismaClient } from "@prisma/client";
import createHttpError from "http-errors";
import logger from "../utils/logger.js";

export class TasksService {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	async getTasksByUserId(userId: string) {
		logger.info("Fetching tasks for user", { userId });
		const tasks = await this.prisma.task.findMany({
			where: { userId },
		});

		logger.info("Tasks fetched successfully", {
			userId,
			taskCount: tasks.length,
		});
		return tasks;
	}

	async getTaskById(taskId: number, userId: string) {
		logger.info("Fetching task by ID", { taskId, userId });
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId) {
			logger.warn("Task not found or unauthorized access", {
				taskId,
				userId,
			});
			throw createHttpError(404, "Tarea no encontrada o no autorizada");
		}

		logger.info("Task fetched successfully", { taskId, userId });
		return task;
	}

	async createTask(
		userId: string,
		title: string,
		description: string | null
	) {
		logger.info("Creating task", { title, userId });
		const task = await this.prisma.task.create({
			data: {
				userId,
				title,
				description,
			},
		});

		logger.info("Task created successfully", { taskId: task.id, userId });
		return task;
	}

	async deleteTask(taskId: number, userId: string) {
		logger.info("Deleting task", { taskId, userId });
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId) {
			logger.warn("Task not found or unauthorized access", {
				taskId,
				userId,
			});
			throw createHttpError(404, "Tarea no encontrada o no autorizada");
		}

		await this.prisma.task.delete({
			where: { id: taskId },
		});

		logger.info("Task deleted successfully", { taskId, userId });
		return { message: "Tarea eliminada correctamente" };
	}

	async updateTask(
		taskId: number,
		userId: string,
		title?: string,
		status?: string,
		description?: string
	) {
		logger.info("Updating task", { taskId, userId });
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
		});

		if (!task || task.userId !== userId) {
			logger.warn("Task not found or unauthorized access", {
				taskId,
				userId,
			});
			throw createHttpError(404, "Tarea no encontrada o no autorizada");
		}

		const updateData: any = {};
		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (status !== undefined) updateData.status = status;

		const updatedTask = await this.prisma.task.update({
			where: { id: taskId },
			data: updateData,
		});

		logger.info("Task updated successfully", { taskId, userId });
		return updatedTask;
	}
}
