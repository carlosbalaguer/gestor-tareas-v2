import type { CorsOptions } from "cors";

export const getCorsOptions = (): CorsOptions => {
	const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

	return {
		origin: (requestOrigin, callback) => {
			if (!requestOrigin) return callback(null, true);

			if (allowedOrigins.includes(requestOrigin))
				return callback(null, true);

			return callback(new Error("Not allowed by CORS"), false);
		},
		credentials: true,
	};
};
