import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
			};
		}
	}
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");

		if (!token)
			return res.status(401).json({
				success: false,
				error: "Token de autenticación no proporcionado",
			});

		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET is not configured");
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
		};

		req.user = {
			id: decoded.userId,
		};

		next();
	} catch (error) {
		next(error);
	}
};
