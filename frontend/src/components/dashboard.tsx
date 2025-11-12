"use client";

import { logout } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateTaskDialog from "./create-task";
import { Button } from "./ui/button";

interface Task {
	id: string;
	title: string;
	description?: string;
	status: "todo" | "in_progress" | "done";
}

export default function Dashboard() {
	const router = useRouter();
	const [draggedTask, setDraggedTask] = useState<Task | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		data: tasks = [],
		isLoading,
		error,
	} = useQuery<Task[]>({
		queryKey: ["tasks"],
		queryFn: getTasks,
	});

	const createTaskMutation = useMutation({
		mutationFn: ({
			title,
			description,
		}: {
			title: string;
			description?: string;
		}) => createTask(title, description || ""),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const updateTaskMutation = useMutation({
		mutationFn: ({
			id,
			title,
			description,
			status,
		}: {
			id: string;
			title?: string;
			description?: string;
			status?: "todo" | "in_progress" | "done";
		}) => updateTask(id, title, description, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (id: string) => deleteTask(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const logoutUser = async () => {
		try {
			await logout();
			router.push("/login");
		} catch (error) {
			console.error("Error al hacer logout:", error);
			router.push("/login");
		}
	};

	const handleDragStart = (task: Task) => {
		setDraggedTask(task);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = async (newStatus: "todo" | "in_progress" | "done") => {
		if (!draggedTask) return;

		try {
			await updateTaskMutation.mutateAsync({
				id: draggedTask.id,
				status: newStatus,
			});
		} catch (error) {
			alert("Error al mover la tarea");
		} finally {
			setDraggedTask(null);
		}
	};

	const handleCreateTask = async (title: string, description: string) => {
		try {
			await createTaskMutation.mutateAsync({ title, description });
			setIsModalOpen(false);
		} catch (error) {
			alert("Error al crear la tarea");
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		try {
			if (confirm("¿Estás seguro de que deseas eliminar esta tarea?"))
				await deleteTaskMutation.mutateAsync(taskId);
		} catch (error) {
			alert("Error al eliminar la tarea");
		}
	};

	const getTasksByStatus = (status: "todo" | "in_progress" | "done") => {
		return tasks.filter((task) => task.status === status);
	};

	const columns = [
		{ id: "todo", title: "Por hacer", status: "todo" as const },
		{
			id: "in_progress",
			title: "En progreso",
			status: "in_progress" as const,
		},
		{ id: "done", title: "Completado", status: "done" as const },
	];

	if (isLoading) {
		return (
			<section className="min-h-screen px-4 sm:px-8 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando tareas...</p>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="min-h-screen px-4 sm:px-8 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">
						Error al cargar las tareas
					</p>
					<Button onClick={() => window.location.reload()}>
						Reintentar
					</Button>
				</div>
			</section>
		);
	}

	return (
		<section
			suppressHydrationWarning
			className="min-h-screen px-4 sm:px-6 lg:px-8"
		>
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 sm:pt-8 mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold">
						Kanban Dashboard
					</h1>
					<div className="flex gap-3">
						<Button
							onClick={() => setIsModalOpen(true)}
							className="flex-1 sm:flex-none"
						>
							Nueva Tarea
						</Button>
						<Button
							onClick={logoutUser}
							variant="outline"
							className="flex-1 sm:flex-none"
						>
							Cerrar sesión
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{columns.map((column) => (
						<div
							key={column.id}
							className="rounded-lg border p-3 sm:p-4"
							onDragOver={handleDragOver}
							onDrop={() => handleDrop(column.status)}
						>
							<h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
								{column.title}
							</h2>

							<div className="space-y-3 min-h-[200px] sm:min-h-[400px]">
								{getTasksByStatus(column.status).map((task) => (
									<div
										key={task.id}
										draggable
										onDragStart={() =>
											handleDragStart(task)
										}
										className="bg-gray-50 p-3 sm:p-4 rounded-lg border relative cursor-move active:opacity-50"
									>
										<button
											onClick={() =>
												handleDeleteTask(task.id)
											}
											className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-lg leading-none"
										>
											×
										</button>
										<h3 className="font-semibold mb-2 pr-8 text-sm sm:text-base">
											{task.title}
										</h3>
										{task.description && (
											<p className="text-xs sm:text-sm text-gray-600">
												{task.description}
											</p>
										)}
									</div>
								))}

								{getTasksByStatus(column.status).length ===
									0 && (
									<div className="text-center text-gray-400 py-8 text-sm">
										No hay tareas
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			<CreateTaskDialog
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleCreateTask}
			/>
		</section>
	);
}
