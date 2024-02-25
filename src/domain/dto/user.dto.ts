/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { CustomError } from "../../server/checkErrorRequest.middleware";
import { type IUser, User, validUserPropertiesUser } from "../entities/User";
import { userOdm } from "../odm/user.odm";

export const countUsers = async (): Promise<number> => {
  const userCount = await userOdm.countUsers();
  if (userCount === null) {
    throw new CustomError("No se pudieron leer los usuarios", 400);
  }

  return userCount;
};

export const createUser = async (userDataValidated: IUser, foto: string): Promise<IUser> => {
  const newUser = await userOdm.saveUser(userDataValidated, foto);
  if (!newUser) {
    throw new CustomError("El usuario no ha sido registrado", 400);
  }

  return newUser;
};

export const getAllUser = async (): Promise<IUser[]> => {
  const userList = await userOdm.getAllUser();
  if (!userList) {
    throw new CustomError("Los usuarios no han sido encontrados", 404);
  }

  return userList;
};

export const verifyInsertData = async (userData: IUser): Promise<IUser> => {
  verifyValidProperties(userData);

  const userToValidate = new User();
  Object.assign(userToValidate, userData);

  if (!userToValidate.nombre) {
    throw new CustomError("El nombre proporcionado no cumple con los requisitos", 400);
  }

  if (!userToValidate.apellido) {
    throw new CustomError("El apellido proporcionado no cumple con los requisitos", 400);
  }

  if (!userToValidate.segundo_apellido) {
    throw new CustomError("El segundo apellido proporcionado no cumple con los requisitos", 400);
  }

  if (!userToValidate.email) {
    throw new CustomError("El correo electrónico proporcionado no cumple con los requisitos", 400);
  }

  if (!userToValidate.telefono) {
    throw new CustomError("El número de teléfono proporcionado no cumple con los requisitos", 400);
  }

  return userToValidate;
};

export const verifyValidProperties = (userData: any): void => {
  const validProperties = validUserPropertiesUser;
  const requiredProperties = validProperties.filter((property) => property !== "dni" && property !== "nie");

  const missingRequiredProperties = requiredProperties.filter((property) => !(property in userData));

  if (!userData.dni && !userData.nie) {
    throw new CustomError("Debes proporcionar el DNI o el NIE.", 400);
  }

  const invalidProperties = Object.keys(userData).filter((property) => !validProperties.includes(property));

  if (missingRequiredProperties.length > 0 || invalidProperties.length > 0) {
    const errorMessages = [];
    if (missingRequiredProperties.length > 0) {
      errorMessages.push(`Propiedades requeridas faltantes: ${missingRequiredProperties.join(", ")}`);
    }
    if (invalidProperties.length > 0) {
      errorMessages.push(`Propiedades no válidas: ${invalidProperties.join(", ")}`);
    }
    throw new CustomError(`Actualización de usuario cancelada. ${errorMessages.join(". ")}`, 400);
  }
};

export const userDto = {
  countUsers,
  createUser,
  verifyInsertData,
  verifyValidProperties,
  getAllUser,
};
