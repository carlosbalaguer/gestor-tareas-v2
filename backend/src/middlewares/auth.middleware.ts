import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import logger from "../utils/logger.js";
import { verifyAccessToken } from "../utils/tokens.js";

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
		const token = req.cookies.accessToken;

		if (!token) {
			logger.warn("Authentication token not provided");
			throw createHttpError(401, "No autenticado");
		}

		const payload = verifyAccessToken(token);

		req.user = {
			id: payload.userId,
		};

		next();
	} catch (error) {
		next(error);
	}
};
