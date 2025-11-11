import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { generalLimiter } from "./config/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import routes from "./routes/index.js";

dotenv.config();

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

export const createApp = () => {
	const app = express();

	app.set("trust proxy", 1);

	if (process.env.NODE_ENV === "test") {
		app.use(cors());
	} else {
		app.use(
			cors({
				origin: (requestOrigin, callback) => {
					if (!requestOrigin)
						return callback(
							new Error("Not allowed by CORS"),
							false
						);
					if (allowedOrigins.includes(requestOrigin)) {
						return callback(null, true);
					}
					return callback(null, false);
				},
			})
		);
	}
	app.use(generalLimiter);

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use("/api", routes);

	app.use(errorHandler);

	return app;
};
