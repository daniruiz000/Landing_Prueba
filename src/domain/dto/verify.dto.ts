import moment from "moment";
import { CustomError } from "../../server/checkErrorRequest.middleware";
import { isPromotionOpened, isPromotionClosed, isMaxNumOfUsers } from "../../utils/promotionUtils";
import { User, validUserPropertiesUser } from "../entities/User";

const authEmail: string = process.env.AUTH_EMAIL as string;
const authPassword: string = process.env.AUTH_PASSWORD as string;
const spainTimezone = "Europe/Madrid";
const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;
const startDate = process.env.PROMOTION_START_DATE as string;
const startDateParsed = moment.tz(startDate, "YYYY-MM-DD HH:mm:ss", spainTimezone) || undefined;
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment.tz(finishDate, "YYYY-MM-DD HH:mm:ss", spainTimezone) || undefined;

export const verifyIsPromotionActive = (): void => {
  const isBeforeStartDate = isPromotionOpened();
  const isAfterFinishDate = isPromotionClosed();

  if (isBeforeStartDate) {
    const formattedStartDate = startDateParsed.format("DD/MM/YYYY - HH:mm:ss");
    throw new CustomError(`Todavía no se pueden añadir usuarios hasta ${formattedStartDate}.`, 400);
  }

  if (isAfterFinishDate) {
    const formattedFinishDate = finishDateParsed.format("DD/MM/YYYY - HH:mm:ss");
    throw new CustomError(`Se ha alcanzado la fecha de finalización ${formattedFinishDate}, no se pueden añadir más usuarios`, 400);
  }
};

export const verifyLimitOfUsers = async (): Promise<void> => {
  if (maxUsersLimit) {
    const isMaxNumberOfUsers = await isMaxNumOfUsers();

    if (isMaxNumberOfUsers) {
      throw new CustomError("Se ha alcanzado el límite máximo de usuarios permitidos que se pueden registrar", 400);
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

const verifyInsertData = async (userData: User): Promise<User> => {
  const userToValidate = new User();
  Object.assign(userToValidate, userData);

  if (userToValidate.nombre && !userToValidate.validateNombre()) {
    throw new CustomError("El nombre proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.apellido && !userToValidate.validateApellido()) {
    throw new CustomError("El apellido proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.segundo_apellido && !userToValidate.validateSegundoApellido()) {
    throw new CustomError("El segundo apellido proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.email && !userToValidate.validateEmail()) {
    throw new CustomError("El correo electrónico proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.telefono && !userToValidate.validatePhoneNumber()) {
    throw new CustomError("El número de teléfono proporcionado no cumple con los requisitos", 400);
  }
  return userToValidate;
};

export const verifyDto = {
  verifyIsPromotionActive,
  verifyLimitOfUsers,
  verifyValidProperties,
  verifyValidCredentials,
  verifyInsertData,
};
