import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	register = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;

			if (!email || !password)
				return res.status(400).json({
					success: false,
					error: "Email y contraseña son obligatorios",
				});

			const result = await this.authService.register(email, password);

			res.status(201).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	};

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;

			if (!email || !password)
				return res.status(400).json({
					success: false,
					error: "Email y contraseña son obligatorios",
				});

			const result = await this.authService.login(email, password);

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	};
}
