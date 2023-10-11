import moment from "moment";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailSender = process.env.EMAIL_SENDER as string;
const emailSenderPassword = process.env.EMAIL_SENDER_PASSWORD as string;
const emailReciver = process.env.EMAIL_RECIVER as string;
const database = process.env.SQL_DATABASE as string;
const promocion = process.env.PROMOCION_NAME as string;

const formatedDate = process.env.FORMAT_DATE_MOMENT as string;
const actualDate = moment();
const actualDateParsed = moment(actualDate, formatedDate).toDate() || undefined;

const sendExcelByEmail = async (workbook: { xlsx: { writeBuffer: () => any } }): Promise<void> => {
  const excelBuffer = await workbook.xlsx.writeBuffer();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
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
    Adjunto encontrarás el archivo Excel con la información de los usuarios inscritos en la promoción de ${promocion}.
    Muchas gracias.
    Un saludo.
    `,
    attachments: [{ filename: "users.xlsx", content: Buffer.from(excelBuffer) }],
  };

  transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
      console.log(`Correo electrónico enviado a: ${emailReciver} con fecha: ${actualDateParsed.toString()}`);
    }
  });
};

export const mailService = {
  sendExcelByEmail,
};
