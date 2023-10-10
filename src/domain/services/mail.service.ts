import nodemailer from "nodemailer";

const emailSender = process.env.EMAIL_SENDER as string;
const emailSenderPassword = process.env.EMAIL_SENDER_PASSWORD as string;
const emailReciver = process.env.EMAIL_RECIVER as string;
const database = process.env.SQL_DATABASE as string;
const promocion = process.env.PROMOCION_NAME as string;

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
    text: `Adjunto encontrarás el archivo Excel con la información de los usuarios inscritos en la promoción de ${promocion}.`,
    attachments: [{ filename: "users.xlsx", content: Buffer.from(excelBuffer) }],
  };

  await transporter.sendMail(mailOptions);
};

export const mailService = {
  sendExcelByEmail,
};
