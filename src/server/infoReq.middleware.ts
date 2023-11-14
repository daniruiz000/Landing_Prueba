import { type Request, type Response, type NextFunction } from "express";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const timezone = process.env.TIME_ZONE as string;

export const infoReq = (req: Request, res: Response, next: NextFunction): void => {
  const actualDate = moment().tz(timezone);
  console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${actualDate.toLocaleString()}`);
  next();
};
