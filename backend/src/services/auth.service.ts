import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
	private prisma: PrismaClient;
	private JWT_SECRET: string;

	constructor() {
		this.prisma = new PrismaClient();
		this.JWT_SECRET = process.env.JWT_SECRET!;

		if (!this.JWT_SECRET) throw new Error("JWT_SECRET no está configurado");
	}

	async register(email: string, password: string) {
		if (!email || !password)
			throw new Error("Email y contraseña son obligatorios");

		const existingUser = await this.prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) throw new Error("El usuario ya existe");

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.prisma.user.create({
			data: {
				email,
				password: hashedPassword,
			},
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
		if (!email || !password)
			throw new Error("Email y contraseña son obligatorios");

		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) throw new Error("Credenciales inválidas");

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) throw new Error("Credenciales inválidas");

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
