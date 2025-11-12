import api from "./api";

export const register = async (email: string, password: string) => {
	const response = await api.post("/auth/register", { email, password });
	return response.data;
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", { email, password });
	return response.data;
};

export const logout = async () => {
	const response = await api.post("/auth/logout");
	return response.data;
};