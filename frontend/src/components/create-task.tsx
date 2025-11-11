"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTaskSchema, type CreateTaskData } from "@/lib/validations/task";
import { ApiError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CreateTaskDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (title: string, description: string) => Promise<void>;
}

export default function CreateTaskDialog({
	isOpen,
	onClose,
	onSubmit,
}: CreateTaskDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<CreateTaskData>({
		resolver: zodResolver(createTaskSchema),
		mode: "onChange",
	});

	const onSubmitForm = async (data: CreateTaskData) => {
		setIsLoading(true);
		setServerError("");

		try {
			await onSubmit(data.title, data.description || "");
			reset();
			onClose();
		} catch (err) {
			const error = err as ApiError;
			let errorMessage = "Error al crear la tarea. Intenta de nuevo.";

			if (
				error.response?.data?.errors &&
				Array.isArray(error.response.data.errors)
			) {
				errorMessage = error.response.data.errors
					.map((e) => e.message)
					.join(", ");
			}

			setServerError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			reset();
			setServerError("");
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nueva Tarea</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmitForm)}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<FieldLabel htmlFor="title">
								Título <span className="text-red-500">*</span>
							</FieldLabel>
							<Input
								id="title"
								{...register("title")}
								placeholder="Ingresa el título de la tarea"
								disabled={isLoading}
								aria-invalid={!!errors.title}
							/>
							{errors.title && (
								<p className="text-sm text-red-500 mt-1">
									{errors.title.message}
								</p>
							)}
						</div>

						<div className="grid gap-2">
							<FieldLabel htmlFor="description">
								Descripción
							</FieldLabel>
							<Textarea
								id="description"
								{...register("description")}
								placeholder="Ingresa la descripción (opcional)"
								rows={4}
								disabled={isLoading}
								aria-invalid={!!errors.description}
							/>
							{errors.description && (
								<p className="text-sm text-red-500 mt-1">
									{errors.description.message}
								</p>
							)}
						</div>

						{serverError && (
							<div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded">
								{serverError}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isLoading}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={isLoading || !isValid}>
							{isLoading ? "Creando..." : "Crear Tarea"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
