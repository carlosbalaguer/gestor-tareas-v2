"use client";

import { getAuthToken, logout } from "@/lib/auth";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/tasks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateTaskDialog from "./create-task";
import { Button } from "./ui/button";

interface Task {
	id: string;
	title: string;
	description?: string;
	status: "todo" | "in-progress" | "done";
}

export default function Dashboard() {
	const router = useRouter();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [draggedTask, setDraggedTask] = useState<Task | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const token = getAuthToken();
		if (!token) {
			router.push("/login");
		}
	}, [router]);

	useEffect(() => {
		const fetchTasks = async () => {
			const response = await getTasks();
			setTasks(response);
		};
		fetchTasks();
	}, []);

	const logoutUser = () => {
		logout();
		router.push("/");
	};

	const handleDragStart = (task: Task) => {
		setDraggedTask(task);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = async (newStatus: "todo" | "in-progress" | "done") => {
		if (!draggedTask) return;

		try {
			await updateTask(
				draggedTask.id,
				draggedTask.title,
				draggedTask.description,
				newStatus
			);
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === draggedTask.id
						? { ...task, status: newStatus }
						: task
				)
			);
		} catch (error) {
			alert("Error al mover la tarea");
		} finally {
			setDraggedTask(null);
		}
	};

	const handleCreateTask = async (title: string, description: string) => {
		const newTask = await createTask(title, description);
		setTasks((prevTasks) => [...prevTasks, newTask]);
	};

	const handleDeleteTask = async (taskId: string) => {
		try {
			if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
				await deleteTask(taskId);
				setTasks((prevTasks) =>
					prevTasks.filter((task) => task.id !== taskId)
				);
			}
		} catch (error) {
			alert("Error al eliminar la tarea");
		}
	};

	const getTasksByStatus = (status: "todo" | "in-progress" | "done") => {
		return Object.values(tasks).filter((task) => task.status === status);
	};

	const columns = [
		{ id: "todo", title: "Por hacer", status: "todo" as const },
		{
			id: "in-progress",
			title: "En progreso",
			status: "in-progress" as const,
		},
		{ id: "done", title: "Completado", status: "done" as const },
	];

	{
		/** Se ha usado IA en este componente para desarrollar una UI más adecuada */
	}

	return (
		<section suppressHydrationWarning className="min-h-screen px-8">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
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
