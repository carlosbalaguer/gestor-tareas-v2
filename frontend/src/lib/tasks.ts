import api from "./api";
import { getAuthToken } from "./auth";

export const getTasks = async () => {
	const response = await api.get("/tasks", {
		headers: { Authorization: `Bearer ${getAuthToken()}` },
	});
	console.log("Get tasks response:", response);
	return response.data.data;
};

export const getTask = async (id: string) => {
	const response = await api.get(`/tasks/${id}`, {
		headers: { Authorization: `Bearer ${getAuthToken()}` },
	});
	console.log("Get task response:", response);
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

	console.log("Create task response:", response);

	return response.data.data;
};

export const updateTask = async (
	id: string,
	title: string,
	description: string | undefined,
	status: string
) => {
	console.log("Updating task with id:", id);
	console.log("New title:", title);
	console.log("New description:", description);
	console.log("New status:", status);
	const response = await api.put(
		`/tasks/${id}`,
		{ title, description, status },
		{
			headers: { Authorization: `Bearer ${getAuthToken()}` },
		}
	);
	console.log("Update task response:", response);
	return response.data.data;
};

export const deleteTask = async (id: string) => {
	const response = await api.delete(`/tasks/${id}`, {
		headers: { Authorization: `Bearer ${getAuthToken()}` },
	});
	return response.data;
};
