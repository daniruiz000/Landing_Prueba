import ExcelJS from "exceljs";
import dotenv from "dotenv";

import { userDto } from "./user.dto";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CustomError } from "../../server/checkErrorRequest.middleware";

dotenv.config();

const formatedDate = process.env.FORMAT_DATE_MOMENT as string;

const createExcelWithUsers = async (): Promise<ExcelJS.Workbook> => {
  try {
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

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

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

    await worksheet.protect("tu_contraseña", {
      objects: true,
      scenarios: true,
      selectLockedCells: true,
      selectUnlockedCells: false,
      formatCells: true,
      formatColumns: true,
      formatRows: true,
      insertColumns: true,
      insertRows: true,
      insertHyperlinks: true,
      deleteColumns: true,
      deleteRows: true,
      sort: true,
      autoFilter: true,
      pivotTables: true,
    });

    return workbook;
  } catch (error) {
    throw new CustomError("Fallo al crear el archivo Excel", 500);
  }
};

export const excelDto = {
  createExcelWithUsers,
};
