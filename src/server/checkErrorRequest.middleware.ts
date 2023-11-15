import { type Request, type Response, type NextFunction } from "express";
import winston from "winston";

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(winston.format.timestamp(), winston.format.simple(), winston.format.json(), winston.format.prettyPrint()),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: "error.log" })],
});

export const checkError = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  logger.error(`Error: ${err.message}`);
  if ("code" in err) {
    const errorCode = err.code;
    switch (errorCode) {
      case "ER_DUP_ENTRY":
        res.status(409).json({ error: "Usuario ya registrado con alguno de estos datos." });
        return;

      case "ENOENT":
        res.status(404).json({ error: "Recurso no encontrado" });
        return;

      case "ER_BAD_DB_ERROR":
        res.status(500).json({ error: "Error interno del servidor - Base de datos no encontrada" });
        return;

      default:
        res.status(500).json({ error: "Error interno del servidor" });
        return;
    }
  }

  if (err.name === "EntityMetadataNotFoundError") {
    res.status(500).json({ error: "Error de tiempo de espera al conectar a la base de datos" });
    return;
  }

  res.status(err.statusCode || 500).json({ error: err.message || "Error interno del servidor" });
};
