import ExcelJS from "exceljs";
import dotenv from "dotenv";
import { userDto } from "./user.dto";
import { CustomError } from "../../server/checkErrorRequest.middleware";

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
      { header: "Email", key: "email", width: 20 },
      { header: "Fecha de Inscripción", key: "createdAt", width: 20 },
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

    let currentRow = 2; // Iniciar en la fila 2 para dejar espacio para los encabezados

    users.forEach((user, index) => {
      // Agregar una fila en blanco
      if (index > 0) {
        currentRow += 5;
        worksheet.addRow({});
        worksheet.addRow({});
        worksheet.addRow({});
        worksheet.addRow({});
      }

      // Agregar una fila para los datos del usuario
      worksheet.addRow({
        nombre: user.nombre.toUpperCase(),
        apellido: user.apellido.toUpperCase(),
        segundo_apellido: user.segundo_apellido.toUpperCase(),
        telefono: user.telefono.toUpperCase(),
        email: user.email.toUpperCase(),
        createdAt: `${user.createdAt.getDate()}/${user.createdAt.getMonth()}/${user.createdAt.getFullYear()} - ${user.createdAt.getHours()}:${user.createdAt.getHours()}:${user.createdAt.getSeconds()}`,
      });

      // Agregar la imagen de "foto" si existe
      if (user.foto) {
        const imgId = workbook.addImage({
          base64: user.foto,
          extension: "jpeg",
        });

        worksheet.addImage(imgId, {
          tl: { col: 7, row: currentRow - 1 },
          ext: { width: 100, height: 100 }, // Ajustar el tamaño según sea necesario
        });
      }
    });

    worksheet.eachRow((row) => {
      row.alignment = { vertical: "middle", horizontal: "center" };
    });

    return workbook;
  } catch (error) {
    throw new CustomError("Fallo al crear el archivo Excel", 500);
  }
};

export const excelDto = {
  createExcelWithUsers,
};
