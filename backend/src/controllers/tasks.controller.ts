import type { NextFunction, Request, Response } from "express";
import { TasksService } from "../services/tasks.service.js";

export class TasksController {
	private tasksService: TasksService;

	constructor() {
		this.tasksService = new TasksService();
	}

	getTasksByUserId = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const userId = req.user?.id;

			if (!userId)
				return res.status(400).json({
					success: false,
					error: "User ID es obligatorio",
				});

			const tasks = await this.tasksService.getTasksByUserId(userId);
			res.status(200).json({ success: true, data: tasks });
		} catch (error) {
			next(error);
		}
	};

	getTaskById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const taskId = Number(req.params.taskId);
			const userId = req.user?.id;

			if (!taskId)
				return res.status(400).json({
					success: false,
					error: "Task ID es obligatorio",
				});
			if (!userId)
				return res.status(400).json({
					success: false,
					error: "User ID es obligatorio",
				});

			const task = await this.tasksService.getTaskById(taskId, userId);
			res.status(200).json({ success: true, data: task });
		} catch (error) {
			next(error);
		}
	};

	createTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id;
			const { title, description } = req.body;

			if (!userId)
				return res.status(400).json({
					success: false,
					error: "User ID es obligatorio",
				});
			if (!title)
				return res.status(400).json({
					success: false,
					error: "El título es obligatorio",
				});

			const task = await this.tasksService.createTask(
				userId,
				title,
				description || null
			);
			res.status(201).json({ success: true, data: task });
		} catch (error) {
			next(error);
		}
	};

	updateTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const taskId = Number(req.params.taskId);
			const userId = req.user?.id;
			const { title, description } = req.body;

			if (!taskId)
				return res.status(400).json({
					success: false,
					error: "Task ID es obligatorio",
				});
			if (!userId)
				return res.status(400).json({
					success: false,
					error: "User ID es obligatorio",
				});
			if (!title)
				return res.status(400).json({
					success: false,
					error: "El título es obligatorio",
				});

			const task = await this.tasksService.updateTask(
				taskId,
				userId,
				title,
				description || null
			);
			res.status(200).json({ success: true, data: task });
		} catch (error) {
			next(error);
		}
	};

	deleteTask = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const taskId = Number(req.params.taskId);
			const userId = req.user?.id;

			if (!taskId)
				return res.status(400).json({
					success: false,
					error: "Task ID es obligatorio",
				});
			if (!userId)
				return res.status(400).json({
					success: false,
					error: "User ID es obligatorio",
				});

			const result = await this.tasksService.deleteTask(taskId, userId);
			res.status(200).json({ success: true, data: result });
		} catch (error) {
			next(error);
		}
	};
}
