export interface User {
	id: string;
	email: string;
}

export interface Task {
	id: number;
	title: string;
	description: string;
	status: "todo" | "in_progress" | "done";
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}

export interface ApiError {
	response?: {
		data?: {
			errors?: Array<{ field?: string; message: string }>;
		};
	};
}
