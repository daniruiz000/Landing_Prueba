import dotenv from "dotenv";
import moment from "moment-timezone";

import { CustomError } from "../server/checkErrorRequest.middleware";
import { userDto } from "../domain/dto/user.dto";
import { validUserPropertiesUser } from "../domain/entities/User";

dotenv.config();

const authEmail: string = process.env.AUTH_EMAIL as string;
const authPassword: string = process.env.AUTH_PASSWORD as string;

const spainTimezone = "Europe/Madrid";
const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;

const startDate = process.env.PROMOTION_START_DATE as string;
const startDateParsed = moment(startDate, "YYYY-MM-DD HH:mm:ss") || undefined;

const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment(finishDate, "YYYY-MM-DD HH:mm:ss") || undefined;

export const verifyIsPromotionActive = (): void => {
  const actualDate = moment().tz(spainTimezone);
  const antesdetiempo = actualDate.isBefore(startDateParsed); // Compara minutos
  const despuesdetiempo = actualDate.isAfter(finishDateParsed); // Compara minutos
  console.log({ antesdetiempo }, { despuesdetiempo }, { actualDate }, { finishDateParsed }, { startDateParsed });

  if (antesdetiempo) {
    const formattedStartDate = startDateParsed.format("DD/MM/YYYY - HH:mm:ss");
    throw new CustomError(`Todavía no se pueden añadir usuarios hasta ${formattedStartDate}.`, 400);
  }

  if (despuesdetiempo) {
    const formattedFinishDate = finishDateParsed.format("DD/MM/YYYY - HH:mm:ss");
    throw new CustomError(`Se ha alcanzado la fecha de finalización ${formattedFinishDate}, no se pueden añadir más usuarios`, 400);
  }
};

export const verifyLimitOfUsers = async (): Promise<void> => {
  if (maxUsersLimit) {
    const numberOfUsers = await userDto.countUsers();
    if (numberOfUsers >= maxUsersLimit) {
      throw new CustomError("Se ha alcanzado el límite máximo de usuarios permitidos", 400);
    }
  }
};

export const verifyValidProperties = (userData: any): void => {
  const invalidProperties = Object.keys(userData).filter((property) => !validUserPropertiesUser.includes(property));

  if (invalidProperties.length > 0) {
    throw new CustomError(`Actualización de usuario cancelada. Propiedades no válidas: ${invalidProperties.join(", ")}`, 400);
  }
};

export const verifyValidCredentials = (req: any): void => {
  if (req.email !== authEmail || req.password !== authPassword) {
    throw new CustomError("No estás autorizado a realizar esta acción.", 403);
  }

  if (!req.email || !req.password) {
    throw new CustomError("Se deben especificar los campos email y password", 400);
  }
};
