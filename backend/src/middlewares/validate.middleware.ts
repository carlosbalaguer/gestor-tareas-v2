import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = (
	schema: z.ZodSchema,
	source: "body" | "params" = "body"
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = source === "params" ? req.params : req.body;
			schema.parse(data);
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errors = error.issues.map((err) => ({
					field: err.path.join("."),
					message: err.message,
				}));

				return res.status(400).json({
					success: false,
					errors,
				});
			}
			next(error);
		}
	};
};
