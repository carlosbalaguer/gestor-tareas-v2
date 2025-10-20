export interface User {
	id: string;
	email: string;
}

export interface Task {
	id: number;
	title: string;
	description: string;
	status: "todo" | "in-progress" | "completed";
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	user: User;
	token: string;
}
