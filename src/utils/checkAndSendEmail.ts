import moment from "moment-timezone";
import dotenv from "dotenv";

import { userDto } from "../domain/dto/user.dto";
import { excelDto } from "../domain/dto/excel.dto";
import { mailDto } from "../domain/dto/mail.dto";

dotenv.config();

const spainTimezone = "Europe/Madrid";
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment.tz(finishDate, "YYYY-MM-DD HH:mm:ss", spainTimezone) || undefined;
const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;

let isMailSent = false;

export const checkAndSendEmail = async (): Promise<void> => {
  if (isMailSent) {
    return;
  }

  const actualDate = moment().tz(spainTimezone);
  const isAfterFinishDate = actualDate.isAfter(finishDateParsed);

  const numberOfUsers = await userDto.countUsers();
  const isMaxNumberOfUsers = maxUsersLimit && numberOfUsers >= maxUsersLimit;

  if (isAfterFinishDate || isMaxNumberOfUsers) {
    console.log("¡Es hora de enviar el correo electrónico!");
    const workbook = await excelDto.createExcelWithUsers();
    await mailDto.sendExcelByEmail(workbook);
    isMailSent = true;
  }
};
