import { Router } from "express";
import authRoutes from "./auth.routes.js";
import tasksRoutes from "./tasks.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tasks", tasksRoutes);

export default router;