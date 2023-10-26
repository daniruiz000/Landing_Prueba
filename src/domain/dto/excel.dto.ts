import ExcelJS from "exceljs";
import dotenv from "dotenv";
import { userDto } from "./user.dto";
import { CustomError } from "../../server/checkErrorRequest.middleware";
import moment from "moment-timezone";

dotenv.config();

const createExcelWithUsers = async (): Promise<ExcelJS.Workbook> => {
  try {
    const users = await userDto.getAllUser();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios");

    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Apellido", key: "apellido", width: 20 },
      { header: "Segundo Apellido", key: "segundo_apellido", width: 20 },
      { header: "Teléfono", key: "telefono", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Fecha de Inscripción", key: "createdAt", width: 40 },
      { header: "Foto", key: "foto", width: 13.5 },
    ];

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

    let currentRow = 2;

    users.forEach((user) => {
      const row = worksheet.addRow({
        nombre: user.nombre.toUpperCase(),
        apellido: user.apellido.toUpperCase(),
        segundo_apellido: user.segundo_apellido.toUpperCase(),
        telefono: user.telefono.toUpperCase(),
        email: user.email.toLocaleLowerCase(),
        createdAt: moment.tz(user.createdAt, "Europe/Madrid").format("DD/MM/YYYY - HH:mm:ss"),
        foto: user.foto ? "Imagen" : "No hay foto",
      });

      if (user.foto) {
        const imgId = workbook.addImage({
          base64: user.foto,
          extension: "png",
        });

        worksheet.addImage(imgId, {
          tl: { col: 6, row: currentRow - 1 },
          ext: { width: 100, height: 100 },
        });

        row.height = 75;
      } else {
        row.height = 30;
      }
      currentRow++;
    });

    worksheet.eachRow((row) => {
      row.alignment = { vertical: "middle", horizontal: "center" };
      for (let i = 1; i <= 7; i++) {
        row.getCell(i).border = {
          top: { style: "medium" },
          bottom: { style: "medium" },
        };
      }
    });

    return workbook;
  } catch (error) {
    throw new CustomError("Fallo al crear el archivo Excel", 500);
  }
};

export const excelDto = {
  createExcelWithUsers,
};
