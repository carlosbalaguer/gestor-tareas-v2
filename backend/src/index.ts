import dotenv from "dotenv";
import express from "express";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api", routes);

app.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
