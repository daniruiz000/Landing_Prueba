import { Router, type Request, type Response, type NextFunction } from "express";
import * as fs from "fs";
import path from "path"; // Asegúrate de importar el módulo 'path'

import { isAuth } from "../server/auth.middleware";
import { userService } from "../domain/services/user.service";
import { generateToken } from "../utils/token";
import { excelService } from "../domain/services/excel.service";
import { mailService } from "../domain/services/mail.service";
import { CustomError } from "../server/checkErrorRequest.middleware";
import { userDto } from "../domain/dto/user.dto";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const authEmail: string = process.env.AUTH_EMAIL as string;
const authPassword: string = process.env.AUTH_PASSWORD as string;

const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;

const formatedDate = process.env.FORMAT_DATE_MOMENT as string;
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment(finishDate, formatedDate).toDate() || undefined;
const startDate = process.env.PROMOTION_START_DATE as string;
const startDateParsed = moment(startDate, formatedDate).toDate() || undefined;
const SQL_DATABASE: string = process.env.SQL_DATABASE as string;

const actualDate = new Date();

const userRouter = Router();

userRouter.get("/generate-excel", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const workbook = await excelService.generateExcel();

      const fileName = `users_${SQL_DATABASE}.xlsx`;

      // Ruta del archivo de salida
      const filePath = path.join(fileName);

      await workbook.xlsx.writeFile(filePath);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on("end", () => {
        fs.unlinkSync(filePath);
        res.end();
      });
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/generate-excel-and-send-mail", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const workbook = await excelService.generateExcel();
      await mailService.sendExcelByEmail(workbook);

      res.status(200).send("Archivo Excel enviado por correo electrónico.");
    } else {
      throw new CustomError("No tienes autorización para realizar esta operación", 403);
    }
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar si START_DATE está definido y si la fecha actual es anterior a la fecha de inicio
    if (startDateParsed && actualDate < startDateParsed) {
      const formattedStartDate = moment(startDateParsed).format("DD/MM/YYYY - HH:mm:ss");
      throw new CustomError(`Todavía no se pueden añadir usuarios hasta ${formattedStartDate}.`, 400);
    }

    // Verificar si FINISH_DATE está definido y si la fecha actual es posterior a la fecha de finalización
    if (finishDateParsed && actualDate >= finishDateParsed) {
      const formattedFinishDate = moment(finishDateParsed).format("DD/MM/YYYY - HH:mm:ss");
      throw new CustomError(`Se ha alcanzado la fecha de finalización ${formattedFinishDate}, no se pueden añadir más usuarios`, 400);
    }

    // Verificar si MAX_USERS_LIMIT está definido y se ha alcanzado el límite máximo de usuarios
    if (maxUsersLimit) {
      const numberOfUsers = await userDto.countUsers();
      if (numberOfUsers >= maxUsersLimit) {
        throw new CustomError("Se ha alcanzado el límite máximo de usuarios permitidos", 400);
      }
    }

    const newUser = await userService.createUser(req, next);
    if (newUser) {
      return res.status(201).send("Usuario añadido correctamente.");
    }
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Se deben especificar los campos email y password", 400);
    }

    const match = email === authEmail && password === authPassword;

    if (!match) {
      throw new CustomError("Email y/o contraseña incorrectos", 401);
    }

    const jwtToken = generateToken(email, password);
    console.log(`Usuario ${email} logado correctamente`);
    return res.status(200).json({ token: jwtToken });
  } catch (error) {
    next(error);
  }
});

/* quitar este codigo:

/*

userRouter.get("/", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const users = await userService.getAllUser(next);
      res.status(200).json(users);
    } else {
      throw new CustomError("No tienes autorización para realizar esta operación", 403);
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const idReceivedInParams = parseInt(req.params.id);
      const user = await userService.getUserById(idReceivedInParams, next);
      if (user) {
        return res.status(200).json(user);
      }
    } else {
      throw new CustomError("Email y/o contraseña incorrectos", 403);
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const updateUser = await userService.updateUser(req, next);
      if (updateUser) {
        return res.status(200).send("Usuario actualizado correctamente.");
      }
    } else {
      throw new CustomError("Email y/o contraseña incorrectos", 403);
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", isAuth, async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.email === authEmail && req.password === authPassword) {
      const idReceivedInParams = parseInt(req.params.id);
      const userDeleted = await userService.deleteUserById(idReceivedInParams, next);
      if (userDeleted) {
        return res.status(200).send("Usuario borrado correctamente.");
      }
    } else {
      throw new CustomError("Email y/o contraseña incorrectos", 403);
    }
  } catch (error) {
    next(error);
  }
});
*/

export default userRouter;
