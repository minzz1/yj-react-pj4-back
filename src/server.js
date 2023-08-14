import "dotenv/config";
import "./db.js";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rentalRouter from "./routers/rentalRouter.js";
import cors from "cors";
import foodsRouter from "./routers/foodsRouter.js";
import userRouter from "./routers/userRouter.js";

const PORT = 8080;
const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://wondrous-semifreddo-7da894.netlify.app"],
  methods: ["GET", "POST"],
  credentials: true,
};

//미들웨어 부분
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/rental", rentalRouter);
app.use("/api/foods", foodsRouter);
app.use("/api/users", userRouter);

const handleListening = () => console.log(`😎Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
