import { Task } from "@/types";
import api from "./api";

export const getTasks = async () => {
	try {
		const response = await api.get("/tasks");
		return response.data.data;
	} catch (error) {
		console.error("Error fetching tasks:", error);
		throw error;
	}
};

export const getTask = async (id: string) => {
	try {
		const response = await api.get(`/tasks/${id}`);
		return response.data.data;
	} catch (error) {
		console.error("Error fetching task:", error);
		throw error;
	}
};

export const createTask = async (title: string, description: string) => {
	try {
		const response = await api.post("/tasks", { title, description });
		return response.data.data;
	} catch (error) {
		console.error("Error creating task:", error);
		throw error;
	}
};

export const updateTask = async (
	id: string,
	title?: string,
	description?: string,
	status?: "todo" | "in_progress" | "done" | undefined
) => {
	try {
		const updateData: Partial<Task> = {};
		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (status !== undefined) updateData.status = status;

		const response = await api.put(`/tasks/${id}`, updateData);
		return response.data.data;
	} catch (error) {
		console.error("Error updating task:", error);
		throw error;
	}
};

export const deleteTask = async (id: string) => {
	try {
		const response = await api.delete(`/tasks/${id}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting task:", error);
		throw error;
	}
};
