import dotenv from "dotenv";
import moment from "moment";

import { CustomError } from "../server/checkErrorRequest.middleware";
import { userDto } from "../domain/dto/user.dto";
import { validUserPropertiesUser } from "../domain/entities/User";

dotenv.config();

const authEmail: string = process.env.AUTH_EMAIL as string;
const authPassword: string = process.env.AUTH_PASSWORD as string;

const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;

const formatedDate = process.env.FORMAT_DATE_MOMENT as string;
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment(finishDate, formatedDate).toDate() || undefined;
const startDate = process.env.PROMOTION_START_DATE as string;
const startDateParsed = moment(startDate, formatedDate).toDate() || undefined;

const actualDate = new Date();

export const verifyIsPromotionActive = (): void => {
  if (startDateParsed && actualDate < startDateParsed) {
    const formattedStartDate = moment(startDateParsed).format("DD/MM/YYYY - HH:mm:ss");
    throw new CustomError(`Todavía no se pueden añadir usuarios hasta ${formattedStartDate}.`, 400);
  }

  if (finishDateParsed && actualDate >= finishDateParsed) {
    const formattedFinishDate = moment(finishDateParsed).format("DD/MM/YYYY - HH:mm:ss");
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
