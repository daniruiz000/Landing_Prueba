import ExcelJS from "exceljs";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { userDto } from "../dto/user.dto";

const generateExcel = async (): Promise<ExcelJS.Workbook> => {
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
    createdAt: format(user.createdAt, "dd-MM-yy HH:mm:ss", { locale: es }),
  }));

  worksheet.addRows(formattedUsers);

  return workbook;
};

export const excelService = {
  generateExcel,
};
