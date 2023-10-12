import ExcelJS from "exceljs";
import dotenv from "dotenv";

import { userDto } from "./user.dto";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CustomError } from "../../server/checkErrorRequest.middleware";

dotenv.config();

const formatedDate = process.env.FORMAT_DATE_MOMENT as string;

const createExcelWithUsers = async (): Promise<ExcelJS.Workbook> => {
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
  if (!workbook) {
    throw new CustomError("Fallo al crear el archivo excel", 500);
  }

  return workbook;
};

export const excelDto = {
  createExcelWithUsers,
};
