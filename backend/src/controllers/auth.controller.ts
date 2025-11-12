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
			const result = await this.authService.register(email, password);

			res.cookie("accessToken", result.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 15 * 60 * 1000,
			});

			res.cookie("refreshToken", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

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
			const result = await this.authService.login(email, password);

			res.cookie("accessToken", result.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 15 * 60 * 1000,
			});

			res.cookie("refreshToken", result.refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	};

	refresh = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const refreshToken = req.cookies.refreshToken;

			if (!refreshToken) {
				return res.status(401).json({
					success: false,
					errors: [{ field: "token", message: "No refresh token" }],
				});
			}

			const result = await this.authService.refreshAccessToken(
				refreshToken
			);

			res.cookie("accessToken", result.accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 15 * 60 * 1000,
			});

			res.status(200).json({
				success: true,
				data: { message: "Token refreshed" },
			});
		} catch (error) {
			next(error);
		}
	};

	logout = async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");

			res.status(200).json({
				success: true,
				data: { message: "Logged out" },
			});
		} catch (error) {
			next(error);
		}
	};
}
