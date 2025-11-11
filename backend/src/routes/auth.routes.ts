import { Router } from "express";
import { authLimiter } from "../config/rateLimiter.js";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();
const authController = new AuthController();

router.post(
	"/register",
	authLimiter,
	validate(registerSchema),
	authController.register
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);

export default router;
