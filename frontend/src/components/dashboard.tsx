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
			<section className="min-h-screen px-8 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
					<p className="text-gray-600">Cargando tareas...</p>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="min-h-screen px-8 flex items-center justify-center">
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
		<section suppressHydrationWarning className="min-h-screen px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center pt-8 mb-8">
					<h1 className="text-3xl font-bold">Kanban Dashboard</h1>
					<div className="flex gap-3">
						<Button onClick={() => setIsModalOpen(true)}>
							Nueva Tarea
						</Button>
						<Button onClick={logoutUser} variant="outline">
							Cerrar sesión
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-6">
					{columns.map((column) => (
						<div
							key={column.id}
							className="rounded-lg border p-4"
							onDragOver={handleDragOver}
							onDrop={() => handleDrop(column.status)}
						>
							<h2 className="text-xl font-semibold mb-4">
								{column.title}
							</h2>

							<div className="space-y-3 min-h-[400px]">
								{getTasksByStatus(column.status).map((task) => (
									<div
										key={task.id}
										draggable
										onDragStart={() =>
											handleDragStart(task)
										}
										className="bg-gray-50 p-4 rounded-lg border relative"
									>
										<button
											onClick={() =>
												handleDeleteTask(task.id)
											}
											className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
										>
											×
										</button>
										<h3 className="font-semibold mb-2">
											{task.title}
										</h3>
										{task.description && (
											<p className="text-sm">
												{task.description}
											</p>
										)}
									</div>
								))}

								{getTasksByStatus(column.status).length === 0 &&
									null}
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
