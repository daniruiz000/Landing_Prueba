import moment from "moment";
import ExcelJS from "exceljs";
import nodemailer from "nodemailer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { userDto } from "../domain/dto/user.dto";

const formatedDate = process.env.FORMAT_DATE_MOMENT as string;
const actualDate = moment();
const actualDateParsed = moment(actualDate, formatedDate).toDate() || undefined;
const finishDate = process.env.PROMOTION_FINISH_DATE as string;
const finishDateParsed = moment(finishDate, formatedDate).toDate() || undefined;

const emailSender = process.env.EMAIL_SENDER as string;
const emailSenderPassword = process.env.EMAIL_SENDER_PASSWORD as string;
const emailReciver = process.env.EMAIL_RECIVER as string;

const database = process.env.SQL_DATABASE as string;
const promocion = process.env.PROMOCION_NAME as string;
const maxUsersLimit = parseInt(process.env.PROMOTION_MAX_USERS_LIMIT as string) || undefined;

let isMailSent = false;

// Función para generar el archivo Excel
export const generateExcel = async (): Promise<any> => {
  const users = await userDto.getAllUser();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Usuarios");

  worksheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Nombre", key: "nombre", width: 20 },
    { header: "Apellido", key: "apellido", width: 20 },
    { header: "Segundo Apellido", key: "segundo_apellido", width: 20 },
    { header: "Teléfono", key: "telefono", width: 20 },
    { header: "Email", key: "email", width: 20 },
    { header: "DNI", key: "dni", width: 20 },
    { header: "Fecha de Inscripción", key: "createdAt", width: 20 },
  ];

  const formattedUsers = users.map((user) => ({
    ...user,
    nombre: user.nombre.toLocaleLowerCase(),
    apellido: user.apellido.toLocaleLowerCase(),
    segundo_apellido: user.segundo_apellido.toLocaleLowerCase(),
    email: user.email.toLocaleLowerCase(),
    dni: user.dni.toLocaleUpperCase(),
    createdAt: format(user.createdAt, formatedDate, { locale: es }),
  }));

  worksheet.addRows(formattedUsers);

  return workbook;
};

// Función para enviar el correo electrónico
export const sendEmailWithExcel = async (workbook: { xlsx: { writeBuffer: () => any } }): Promise<void> => {
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

// Función para verificar la fecha de finalización y enviar el correo
export const checkAndSendEmail = async (): Promise<void> => {
  if (!isMailSent) {
    const numberOfUsers = await userDto.countUsers();
    if (actualDateParsed >= finishDateParsed || (maxUsersLimit && numberOfUsers >= maxUsersLimit)) {
      console.log("¡Es hora de enviar el correo electrónico!");
      const workbook = await generateExcel();
      await sendEmailWithExcel(workbook);
      isMailSent = true;
    }
  }
};
