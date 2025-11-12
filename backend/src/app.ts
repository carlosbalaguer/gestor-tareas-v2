import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { getCorsOptions } from "./config/cors.js";
import { generalLimiter } from "./config/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import routes from "./routes/index.js";

export const createApp = () => {
	const app = express();

	app.set("trust proxy", 1);

	if (process.env.NODE_ENV === "test") {
		app.use(cors());
	} else {
		app.use(cors(getCorsOptions()));
	}
	app.use(generalLimiter);

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());

	app.use("/api", routes);

	app.use(errorHandler);

	return app;
};
