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
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Apellido", key: "apellido", width: 20 },
      { header: "Segundo Apellido", key: "segundo_apellido", width: 20 },
      { header: "Teléfono", key: "telefono", width: 20 },
      { header: "Email", key: "email", width: 20 },
      { header: "DNI", key: "dni", width: 20 },
      { header: "Fecha de Inscripción", key: "createdAt", width: 20 },
      { header: "Foto", key: "foto", width: 20 },
      { header: "Factura", key: "factura", width: 20 },
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
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        segundo_apellido: user.segundo_apellido,
        telefono: user.telefono,
        email: user.email,
        dni: user.dni,
        createdAt: user.createdAt,
      });

      // Agregar la imagen de "foto" si existe
      if (user.foto) {
        const imgId = workbook.addImage({
          base64: user.foto,
          extension: "jpeg",
        });

        worksheet.addImage(imgId, {
          tl: { col: 8, row: currentRow - 1 },
          ext: { width: 100, height: 100 }, // Ajustar el tamaño según sea necesario
        });
      }

      // Agregar la imagen de "factura" si existe
      if (user.factura) {
        const imgId = workbook.addImage({
          base64: user.factura,
          extension: "jpeg",
        });

        worksheet.addImage(imgId, {
          tl: { col: 9, row: currentRow - 1 },
          ext: { width: 100, height: 100 }, // Ajustar el tamaño según sea necesario
        });
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
