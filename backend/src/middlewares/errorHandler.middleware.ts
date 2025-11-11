import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import logger from "../utils/logger.js";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (createHttpError.isHttpError(error)) {
		logger.warn("HTTP error occurred", {
			status: error.status,
			message: error.message,
		});
		return res.status(error.status).json({
			success: false,
			error: error.message,
		});
	}

	logger.error("Unexpected error occurred", { message: error.message });
	return res.status(500).json({
		success: false,
		error: {
			message: error.message,
		},
	});
};
