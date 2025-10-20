import api from "./api";

export const register = async (email: string, password: string) => {
	const response = await api.post("/auth/register", { email, password });
	return response.data;
};

export const login = async (email: string, password: string) => {
	const response = await api.post("/auth/login", { email, password });
	return response.data;
};

export const setAuthToken = (token: string) => {
	localStorage.setItem("token", token);
};

export const getAuthToken = (): string | null => {
	return localStorage.getItem("token");
};

export const removeAuthToken = () => {
	localStorage.removeItem("token");
};

export const logout = () => {
	removeAuthToken();
};
