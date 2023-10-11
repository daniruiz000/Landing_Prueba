import { verifyToken } from "../utils/token";
import { type Response, type NextFunction } from "express";

export const isAuth = (req: any, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization;

    if (!token?.startsWith("Bearer ")) {
      // Validar que el token tenga el formato adecuado
      throw new Error("Token de autorización no válido");
    }

    const tokenValue = token.split(" ")[1];
    const decodedInfo = verifyToken(tokenValue);

    // Verificar si el token ha caducado
    if (new Date(decodedInfo.exp * 1000) <= new Date()) {
      throw new Error("Token caducado");
    }

    req.email = decodedInfo.email;
    req.password = decodedInfo.password;
    next();
  } catch (error) {
    // Pasar el error al siguiente middleware para su manejo uniforme
    next(error);
  }
};
