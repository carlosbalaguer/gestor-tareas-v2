import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				await api.post("/auth/refresh");

				return api(originalRequest);
			} catch (refreshError) {
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
