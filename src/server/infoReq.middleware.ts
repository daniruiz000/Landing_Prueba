import { type Request, type Response, type NextFunction } from "express";
import moment from "moment";

const spainTimezone = "Europe/Madrid";

export const infoReq = (req: Request, res: Response, next: NextFunction): void => {
  const actualDate = moment().tz(spainTimezone);
  console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${actualDate.toLocaleString()}`);
  next();
};
