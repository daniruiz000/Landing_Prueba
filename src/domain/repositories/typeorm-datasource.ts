import dotenv from "dotenv";
import "reflect-metadata";

import { DataSource } from "typeorm";
import { User } from "../entities/User";

dotenv.config();

const SQL_PORT: string = process.env.SQL_PORT as string;
const SQL_HOST: string = process.env.SQL_HOST as string;
const SQL_USER: string = process.env.SQL_USER as string;
const SQL_PASSWORD: string = process.env.SQL_PASSWORD as string;
const SQL_DATABASE: string = process.env.SQL_DATABASE as string;

export const AppDataSource = new DataSource({
  type: "mysql", // Tipo de base de datos (MySQL)
  host: SQL_HOST, // Host de la base de datos
  port: parseInt(SQL_PORT), // Puerto de la base de datos (por defecto para MySQL)
  username: SQL_USER, // Nombre de usuario de la base de datos
  password: SQL_PASSWORD, // Contraseña de la base de datos
  database: SQL_DATABASE, // Nombre de la base de datos
  synchronize: true, // Esto sincronizará automáticamente las entidades con la base de datos (solo para desarrollo, no se recomienda en producción)
  logging: false, // Puedes habilitar el registro de consultas si lo deseas
  entities: [User],
});
