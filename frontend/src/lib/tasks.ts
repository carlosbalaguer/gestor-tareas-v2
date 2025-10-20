import api from "./api";
import { getAuthToken } from "./auth";

export const getTasks = async () => {
	const response = await api.get("/tasks", {
		headers: { Authorization: `Bearer ${getAuthToken()}` },
	});
	return response.data.data;
};

export const getTask = async (id: string) => {
	const response = await api.get(`/tasks/${id}`, {
		headers: { Authorization: `Bearer ${getAuthToken()}` },
	});
	return response.data.data;
};

export const createTask = async (title: string, description: string) => {
	const response = await api.post(
		"/tasks",
		{ title, description },
		{
			headers: { Authorization: `Bearer ${getAuthToken()}` },
		}
	);

	return response.data.data;
};

export const updateTask = async (
	id: string,
	title: string,
	description: string | undefined,
	status: string
) => {
	const response = await api.put(
		`/tasks/${id}`,
		{ title, description, status },
		{
			headers: { Authorization: `Bearer ${getAuthToken()}` },
		}
	);
	return response.data.data;
};

export const deleteTask = async (id: string) => {
	const response = await api.delete(`/tasks/${id}`, {
		headers: { Authorization: `Bearer ${getAuthToken()}` },
	});
	return response.data;
};
