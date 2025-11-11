import { z } from "zod";

export const registerSchema = z.object({
	email: z.email("El email es requerido"),
	password: z
		.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
	email: z.email("El email es requerido"),
	password: z
		.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
