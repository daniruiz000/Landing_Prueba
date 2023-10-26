import { mailDto } from "../domain/dto/mail.dto";
import { isMaxNumOfUsers, isPromotionClosed } from "./verifyIData";

let isMailSent = false;

export const checkAndSendEmail = async (): Promise<void> => {
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
