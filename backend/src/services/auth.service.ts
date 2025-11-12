import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";
import logger from "../utils/logger.js";

export class AuthService {
	private JWT_SECRET: string;

	constructor() {
		this.JWT_SECRET = process.env.JWT_SECRET!;

		if (!this.JWT_SECRET) throw new Error("JWT_SECRET no está configurado");
	}

	async register(email: string, password: string) {
		logger.info("Registration attempt", { email });
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			logger.warn("User already exists", { email });
			throw createHttpError(400, "El email ya está registrado");
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
		});

		logger.info("User registered successfully", {
			userId: user.id,
			email: user.email,
		});

		const token = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
			expiresIn: "7d",
		});

		return {
			user: {
				id: user.id,
				email: user.email,
			},
			token,
		};
	}

	async login(email: string, password: string) {
		logger.info("Login attempt", { email });
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			logger.warn("Login failed: user not found", { email });
			throw createHttpError(400, "Credenciales inválidas");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			logger.warn("Login failed: invalid password", { email });
			throw createHttpError(400, "Credenciales inválidas");
		}

		logger.info("User logged in successfully", {
			userId: user.id,
			email: user.email,
		});

		const token = jwt.sign({ userId: user.id }, this.JWT_SECRET, {
			expiresIn: "7d",
		});

		return {
			user: {
				id: user.id,
				email: user.email,
			},
			token,
		};
	}
}
