import { error } from "console";
import { type Request, type Response, type NextFunction } from "express";

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Función auxiliar para manejar errores de duplicación en MySQL
const handleDuplicateError = (err: any, res: Response): boolean => {
  if ("sqlMessage" in err) {
    res.status(409).json({ error: "Usuario ya registrado con alguno de estos datos." });
    return true;
  }
  return false;
};

// Middleware de manejo de errores personalizado
export const checkError = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err.message);

  if ("code" in err) {
    const errorCode = err.code;
    switch (errorCode) {
      case "ER_DUP_ENTRY":
        if (handleDuplicateError(err, res)) {
          return;
        }
        break;
      case "ENOENT":
        res.status(404).json({ error: "Recurso no encontrado" });
        return;
      default:
        break;
    }
  }
  res.status(err.statusCode).json({ error: err.message });
};
