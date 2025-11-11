import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (createHttpError.isHttpError(error)) {
		return res.status(error.status).json({
			success: false,
			error: error.message,
		});
	}

	return res.status(500).json({
		success: false,
		error: {
			message: error.message,
		},
	});
};
