"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/ui/field";

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
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		setIsLoading(true);
		try {
			await onSubmit(title, description);
			setTitle("");
			setDescription("");
			onClose();
		} catch (error) {
			console.error("Error creating task:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		if (!isLoading) {
			setTitle("");
			setDescription("");
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nueva Tarea</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<FieldLabel htmlFor="title">
								Título <span className="text-red-500">*</span>
							</FieldLabel>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Ingresa el título de la tarea"
								required
								disabled={isLoading}
							/>
						</div>

						<div className="grid gap-2">
							<FieldLabel htmlFor="description">
								Descripción
							</FieldLabel>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Ingresa la descripción (opcional)"
								rows={4}
								disabled={isLoading}
							/>
						</div>
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
						<Button
							type="submit"
							disabled={isLoading || !title.trim()}
						>
							{isLoading ? "Creando..." : "Crear Tarea"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
