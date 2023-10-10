import express, { type Request, type Response } from "express";
import cors from "cors";

import userRouter from "./routes/user.routes";

import { AppDataSource } from "./domain/repositories/typeorm-datasource";

import { infoReq } from "./server/infoReq.middleware";
import { checkError } from "./server/checkErrorRequest.middleware";

const API_PORT: string = process.env.API_PORT as string;
const CORS_API_ORIGIN: string = process.env.CORS_API_ORIGIN as string;

const main = async (): Promise<void> => {
  // Conexión a la BBDD
  const dataSource = await AppDataSource.initialize();

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
  const homeRouter = express.Router();
  homeRouter.get("/", (req: Request, res: Response) => {
    res.send(`<h3>Esta es la home de nuestra API.</h3>
    <p> Estamos utilizando la BBDD TypeORM de ${dataSource.options.database as string}.</p>`);
  });
  homeRouter.get("*", (req: Request, res: Response) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Middleware previo de Info de la req.
  app.use(infoReq);

  // Usamos las rutas
  app.use("/user", userRouter);
  app.use("/", homeRouter);

  // Middleware de gestión de los Errores.
  app.use(checkError);

  app.listen(API_PORT, () => {
    console.log(`Server levantado en el puerto ${API_PORT}`);
  });
};

void main();
