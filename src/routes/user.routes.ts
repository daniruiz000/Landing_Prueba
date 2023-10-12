import express from "express";
import { userService } from "../domain/services/user.service";

export const userRouter = express.Router();

userRouter.post("/add-user", userService.createUser);

// userRouter.get("/", isAuth, async (req: any, res: Response, next: NextFunction) => {
//   try {
//     if (req.email === authEmail && req.password === authPassword) {
//       const users = await userService.getAllUser(next);
//       res.status(200).json(users);
//     } else {
//       throw new CustomError("No tienes autorización para realizar esta operación", 403);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// userRouter.get("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
//   try {
//     if (req.email === authEmail && req.password === authPassword) {
//       const idReceivedInParams = parseInt(req.params.id);
//       const user = await userService.getUserById(idReceivedInParams, next);
//       if (user) {
//         return res.status(200).json(user);
//       }
//     } else {
//       throw new CustomError("Email y/o contraseña incorrectos", 403);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// userRouter.put("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
//   try {
//     if (req.email === authEmail && req.password === authPassword) {
//       const updateUser = await userService.updateUser(req, next);
//       if (updateUser) {
//         return res.status(200).send("Usuario actualizado correctamente.");
//       }
//     } else {
//       throw new CustomError("Email y/o contraseña incorrectos", 403);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// userRouter.delete("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
//   try {
//     if (req.email === authEmail && req.password === authPassword) {
//       const idReceivedInParams = parseInt(req.params.id);
//       const userDeleted = await userService.deleteUserById(idReceivedInParams, next);
//       if (userDeleted) {
//         return res.status(200).send("Usuario borrado correctamente.");
//       }
//     } else {
//       throw new CustomError("Email y/o contraseña incorrectos", 403);
//     }
//   } catch (error) {
//     next(error);
//   }
// });
