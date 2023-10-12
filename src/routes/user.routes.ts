import express from "express";
import { userService } from "../domain/services/user.service";
import { isAuth } from "../server/auth.middleware";

export const userRouter = express.Router();

userRouter.post("/add-user", userService.createUser);
userRouter.get("/get-all-users", isAuth, userService.getAllUsers);
userRouter.get("/get-user-by-id/:id", isAuth, userService.getUserById);
userRouter.delete("/delete-user-by-id/:id", isAuth, userService.deleteUserById);
userRouter.put("/update-user-by-id/:id", isAuth, userService.updateUserById);
