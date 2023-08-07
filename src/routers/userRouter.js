import express from "express";
import { postRegisterMember } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.post("/register", postRegisterMember);

export default userRouter;
