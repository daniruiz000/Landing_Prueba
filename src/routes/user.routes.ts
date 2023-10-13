import multer from "multer";
import express from "express";
import { userService } from "../domain/services/user.service";
import { isAuth } from "../server/auth.middleware";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const userRouter = express.Router();

userRouter.post("/add-user", upload.fields([{ name: "foto" }, { name: "factura" }]), userService.createUser);
userRouter.get("/get-all-users", isAuth, userService.getAllUsers);
userRouter.get("/get-user-by-id/:id", isAuth, userService.getUserById);
userRouter.delete("/delete-user-by-id/:id", isAuth, userService.deleteUserById);
userRouter.put("/update-user-by-id/:id", isAuth, upload.fields([{ name: "foto" }, { name: "factura" }]), userService.updateUserById);
