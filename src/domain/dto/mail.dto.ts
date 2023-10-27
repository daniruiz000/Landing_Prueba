import nodemailer from "nodemailer";
import moment from "moment-timezone";
import dotenv from "dotenv";

import { CustomError } from "../../server/checkErrorRequest.middleware";
import { type Workbook } from "exceljs";
import { excelDto } from "./excel.dto";

dotenv.config();

const emailService = process.env.EMAIL_SERVICE as string;
const emailSender = process.env.EMAIL_SENDER as string;
const emailSenderPassword = process.env.EMAIL_SENDER_PASSWORD as string;
const emailReciver = process.env.EMAIL_RECIVER as string;
const database = process.env.SQL_DATABASE as string;
const promotion = process.env.PROMOCION_NAME as string;
const timezone = process.env.TIME_ZONE as string;

const sendExcelByEmail = async (workbook: Workbook): Promise<void> => {
  try {
    const actualDate = moment.tz(timezone);
    const actualDateParsed = actualDate.toLocaleString();

    const excelBuffer = await workbook.xlsx.writeBuffer();

    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailSender,
        pass: emailSenderPassword,
      },
    });

    const mailOptions = {
      from: emailSender,
      to: emailReciver,
      subject: `Excel de usuarios de la promoción: ${database}.`,
      text: `
      Hola, buenas.
      Adjunto encontrarás el archivo Excel con la información de los usuarios inscritos en la promoción de ${promotion}.
      Muchas gracias.
      Un saludo.
      `,
      attachments: [{ filename: `usuarios-${promotion}.xlsx`, content: Buffer.from(excelBuffer) }],
    };

    transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
      if (error) {
        throw new CustomError(`Error al enviar el correo ${error.error}`, 400);
      }
      console.log(`Correo electrónico enviado a: ${emailReciver} con fecha: ${actualDateParsed}`);
    });
  } catch (error) {
    throw new CustomError("Error al crear el correo", 500);
  }
};

export const sendExcelWithUsersByMail = async (): Promise<void> => {
  const workbook = await excelDto.createExcelWithUsers();
  await mailDto.sendExcelByEmail(workbook);
};

export const mailDto = {
  sendExcelByEmail,
  sendExcelWithUsersByMail,
};
