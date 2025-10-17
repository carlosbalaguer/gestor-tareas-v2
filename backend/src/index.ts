import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
	response.status(200).send("Hello Woraldaasa!");
});

app.listen(PORT, () => {
	console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
	throw new Error(error.message);
});
