import { Router } from "express";
import { TasksController } from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
	createTaskSchema,
	taskIdSchema,
	updateTaskSchema,
} from "../schemas/task.schema.js";

const router = Router();
const tasksController = new TasksController();

router.get("/", authMiddleware, tasksController.getTasksByUserId);
router.get(
	"/:taskId",
	authMiddleware,
	validate(taskIdSchema, "params"),
	tasksController.getTaskById
);

router.post(
	"/",
	authMiddleware,
	validate(createTaskSchema),
	tasksController.createTask
);

router.delete(
	"/:taskId",
	authMiddleware,
	validate(taskIdSchema, "params"),
	tasksController.deleteTask
);

router.put(
	"/:taskId",
	authMiddleware,
	validate(taskIdSchema, "params"),
	validate(updateTaskSchema),
	tasksController.updateTask
);

export default router;
