import { type Response, type NextFunction, type Request } from "express";
import { verifyToken } from "../utils/token";

export interface CustomRequest extends Request {
  email?: string;
  password?: string;
}

export const isAuth = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("No se encontró el token de autorización");
    }

    const decodedInfo = verifyToken(token);
    req.email = decodedInfo.email;
    req.password = decodedInfo.password;
    next();
  } catch (error) {
    res.status(403).json("No tienes autorización para realizar esta operación");
  }
};
