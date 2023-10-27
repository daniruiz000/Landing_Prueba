import moment from "moment-timezone";
import { CustomError } from "../../server/checkErrorRequest.middleware";
import { isPromotionOpened, isPromotionClosed, isMaxNumOfUsers } from "../../utils/promotionUtils";

const authEmail: string = process.env.AUTH_EMAIL as string;
const authPassword: string = process.env.AUTH_PASSWORD as string;
const timezone = process.env.TIME_ZONE as string;
const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;
const startDate = process.env.PROMOTION_START_DATE as string;
const startDateParsed = moment.tz(startDate, "YYYY-MM-DD HH:mm:ss", timezone) || undefined;
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment.tz(finishDate, "YYYY-MM-DD HH:mm:ss", timezone) || undefined;
const formatDate = process.env.FORMAT_DATE_MOMENT as string;

export const verifyIsPromotionActive = (): void => {
  const isBeforeStartDate = isPromotionOpened();
  const isAfterFinishDate = isPromotionClosed();

  if (isBeforeStartDate) {
    const formattedStartDate = startDateParsed.format(formatDate);
    throw new CustomError(`Todavía no se pueden añadir usuarios hasta ${formattedStartDate}.`, 400);
  }

  if (isAfterFinishDate) {
    const formattedFinishDate = finishDateParsed.format(formatDate);
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

export const verifyValidCredentials = (req: any): void => {
  if (req.email !== authEmail || req.password !== authPassword) {
    throw new CustomError("No estás autorizado a realizar esta acción.", 403);
  }

  if (!req.email || !req.password) {
    throw new CustomError("Se deben especificar los campos email y password", 400);
  }
};

export const promotionDto = {
  verifyIsPromotionActive,
  verifyLimitOfUsers,
  verifyValidCredentials,
};
