import { rateLimit } from "express-rate-limit";
import logger from "../utils/logger.js";

export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	message: {
		success: false,
		errors: [
			{
				field: "general",
				message:
					"Demasiadas peticiones. Por favor, intenta de nuevo más tarde.",
			},
		],
	},
	standardHeaders: true,
	legacyHeaders: false,
	skip: () => process.env.NODE_ENV === "test",
	handler: (req, res) => {
		logger.warn("Rate limit exceeded", {
			ip: req.ip,
			path: req.path,
			userAgent: req.get("user-agent"),
		});
		res.status(429).json({
			success: false,
			errors: [
				{
					field: "general",
					message:
						"Demasiadas peticiones. Por favor, intenta de nuevo más tarde.",
				},
			],
		});
	},
});
