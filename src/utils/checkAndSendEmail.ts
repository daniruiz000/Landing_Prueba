import moment from "moment";
import dotenv from "dotenv";

import { userDto } from "../domain/dto/user.dto";
import { excelDto } from "../domain/dto/excel.dto";
import { mailDto } from "../domain/dto/mail.dto";

dotenv.config();

const formatedDate = process.env.FORMAT_DATE_MOMENT as string;
const actualDate = moment();
const actualDateParsed = moment(actualDate, formatedDate).toDate() || undefined;
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment(finishDate, formatedDate).toDate() || undefined;
const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;
let isMailSent = false;

export const checkAndSendEmail = async (): Promise<void> => {
  if (!isMailSent) {
    const numberOfUsers = await userDto.countUsers();
    if (actualDateParsed >= finishDateParsed || (maxUsersLimit && numberOfUsers >= maxUsersLimit)) {
      console.log("¡Es hora de enviar el correo electrónico!");
      const workbook = await excelDto.createExcelWithUsers();
      await mailDto.sendExcelByEmail(workbook);
      isMailSent = true;
    }
  }
};
