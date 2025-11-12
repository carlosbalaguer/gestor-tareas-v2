import type { CorsOptions } from "cors";

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

export const corsOptions: CorsOptions = {
	origin: (requestOrigin, callback) => {
		if (!requestOrigin)
			return callback(new Error("Not allowed by CORS"), false);
		if (allowedOrigins.includes(requestOrigin)) {
			return callback(null, true);
		}
		return callback(null, false);
	},
};
