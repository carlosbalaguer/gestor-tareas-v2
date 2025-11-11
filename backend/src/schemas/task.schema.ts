import { z } from "zod";

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(1, "El título es requerido")
		.max(100, "El título no puede exceder 100 caracteres"),

	description: z
		.string()
		.max(500, "La descripción no puede exceder 500 caracteres")
		.nullable()
		.optional(),
});

export const updateTaskSchema = z
	.object({
		title: z
			.string()
			.min(1, "El título no puede estar vacío")
			.max(100, "El título no puede exceder 100 caracteres")
			.optional(),

		description: z
			.string()
			.max(500, "La descripción no puede exceder 500 caracteres")
			.nullable()
			.optional(),

		status: z
			.enum(["todo", "in_progress", "done"] as const, {
				error: () => ({
					message:
						"Estado inválido. Debe ser todo, in_progress o done",
				}),
			})
			.optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "Debe proporcionar al menos un campo para actualizar",
	});

export const taskIdSchema = z.object({
	taskId: z
		.string({ error: "El ID de la tarea es requerido" })
		.min(1, "El ID de la tarea es requerido"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParams = z.infer<typeof taskIdSchema>;
