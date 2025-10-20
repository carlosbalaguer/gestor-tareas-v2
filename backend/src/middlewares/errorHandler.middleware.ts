import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	return res.status(500).json({
		success: false,
		error: {
			message: error.message,
		},
	});
};