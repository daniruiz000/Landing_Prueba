import multer from "multer";
import express from "express";
import { userService } from "../domain/services/user.service";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const userRouter = express.Router();

userRouter.post("/add-user", upload.fields([{ name: "foto" }]), userService.createUser);
