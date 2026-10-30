import express from "express";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import cors from "cors";



const app = express();

app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173"]
}))

app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);

export default app;