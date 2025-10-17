import { Router } from "express";
import { TasksController } from "../controllers/tasks.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
const tasksController = new TasksController();

router.get("/", authMiddleware, tasksController.getTasksByUserId);
router.get("/:taskId", authMiddleware, tasksController.getTaskById);
router.post("/", authMiddleware, tasksController.createTask);
router.delete("/:taskId", authMiddleware, tasksController.deleteTask);
router.put("/:taskId", authMiddleware, tasksController.updateTask);

export default router;
