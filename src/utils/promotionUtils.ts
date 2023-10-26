import dotenv from "dotenv";
import moment from "moment-timezone";

import { userDto } from "../domain/dto/user.dto";
import { mailDto } from "../domain/dto/mail.dto";

dotenv.config();

const spainTimezone = "Europe/Madrid";
const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;
const startDate = process.env.PROMOTION_START_DATE as string;
const startDateParsed = moment.tz(startDate, "YYYY-MM-DD HH:mm:ss", spainTimezone) || undefined;
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment.tz(finishDate, "YYYY-MM-DD HH:mm:ss", spainTimezone) || undefined;

let isMailSent = false;

export const isPromotionOpened = (): boolean => {
  const actualDate = moment().tz(spainTimezone);
  const isBeforeStartDate = actualDate.isBefore(startDateParsed);
  if (!isBeforeStartDate) {
    return false;
  }
  return true;
};

export const isPromotionClosed = (): boolean => {
  const actualDate = moment().tz(spainTimezone);
  const isAfterFinishDate = actualDate.isAfter(finishDateParsed);
  if (!isAfterFinishDate) {
    return false;
  }
  return true;
};

export const isMaxNumOfUsers = async (): Promise<boolean> => {
  const numberOfUsers = await userDto.countUsers();
  const isMaxNumberOfUsers = maxUsersLimit && numberOfUsers >= maxUsersLimit;

  if (!isMaxNumberOfUsers) {
    return false;
  }
  return true;
};

export const checkPromotionIsFinishAndSendEmail = async (): Promise<void> => {
  if (isMailSent) {
    return;
  }

  const isAfterFinishDate = isPromotionClosed();
  const isMaxNumberOfUsers = await isMaxNumOfUsers();
  if (!isAfterFinishDate && !isMaxNumberOfUsers) {
    return;
  }

  console.log("Ha finalizado la promoción. ¡Es hora de enviar el correo electrónico!");
  await mailDto.sendExcelWithUsersByMail();
  isMailSent = true;
};
