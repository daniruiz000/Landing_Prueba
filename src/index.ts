import express from "express";
import cors from "cors";

import dotenv from "dotenv";

import { checkAndSendEmail } from "./utils/generateExcel"; // Importa las funciones necesarias
import userRouter from "./routes/user.routes";
import homeRouter from "./routes/home.routes";
import { AppDataSource } from "./domain/repositories/typeorm-datasource";
import { checkError } from "./server/checkErrorRequest.middleware";

dotenv.config();

const API_PORT: string = process.env.API_PORT as string;
const CORS_API_ORIGIN: string = process.env.CORS_API_ORIGIN as string;

const main = async (): Promise<void> => {
  setInterval(checkAndSendEmail, 60000);

  // Conexión a la BBDD
  await AppDataSource.initialize();

  // Configuración del server
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: CORS_API_ORIGIN,
    })
  );

  // Rutas
  app.use("/user", userRouter);
  app.use("/", homeRouter);

  // Middleware de gestión de los Errores.
  app.use(checkError);

  app.listen(API_PORT, () => {
    console.log(`Server levantado en el puerto ${API_PORT}`);
  });
};

void main();
