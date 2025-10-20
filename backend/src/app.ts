import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import routes from "./routes/index.js";

dotenv.config();

export const createApp = () => {
	const app = express();

	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use("/api", routes);
	app.use(errorHandler);

	return app;
};
