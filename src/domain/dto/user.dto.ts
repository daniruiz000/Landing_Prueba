import { CustomError } from "../../server/checkErrorRequest.middleware";
import { User, validUserPropertiesUser } from "../entities/User";

import { userOdm } from "../odm/user.odm";

const countUsers = async (): Promise<number> => {
  const userCount = await userOdm.countUsers();
  if (userCount === null) {
    throw new CustomError("No se pudieron leer los usuarios", 400);
  }

  return userCount;
};

const createUser = async (userDataValidated: User, foto: any): Promise<User> => {
  const newUser = await userOdm.saveUser(userDataValidated, foto);
  if (!newUser) {
    throw new CustomError("El usuario no ha sido registrado", 400);
  }

  return newUser;
};

const getAllUser = async (): Promise<User[]> => {
  const userList = await userOdm.getAllUser();
  if (!userList) {
    throw new CustomError("Los usuarios no han sido encontrados", 404);
  }

  return userList;
};

const verifyInsertData = async (userData: User): Promise<User> => {
  verifyValidProperties(userData);

  const userToValidate = new User();
  Object.assign(userToValidate, userData);

  if (userToValidate.nombre && !userToValidate.validateNombre()) {
    throw new CustomError("El nombre proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.apellido && !userToValidate.validateApellido()) {
    throw new CustomError("El apellido proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.segundo_apellido && !userToValidate.validateSegundoApellido()) {
    throw new CustomError("El segundo apellido proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.email && !userToValidate.validateEmail()) {
    throw new CustomError("El correo electrónico proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.telefono && !userToValidate.validatePhoneNumber()) {
    throw new CustomError("El número de teléfono proporcionado no cumple con los requisitos", 400);
  }

  return userToValidate;
};

export const verifyValidProperties = (userData: any): void => {
  const invalidProperties = Object.keys(userData).filter((property) => !validUserPropertiesUser.includes(property));
  const isInvalidProperties = invalidProperties.length > 0;

  if (isInvalidProperties) {
    throw new CustomError(`Actualización de usuario cancelada. Propiedades no válidas: ${invalidProperties.join(", ")}`, 400);
  }
};

const getUserById = async (id: number): Promise<User> => {
  const user = await userOdm.getUserById(id);
  if (!user) {
    throw new CustomError("El usuario no ha sido encontrado", 404);
  }

  return user;
};

const updateUser = async (userData: any, idReceivedInParams: number, foto: any): Promise<User> => {
  const userToUpdate = await userDto.getUserById(idReceivedInParams);
  if (!userToUpdate) {
    throw new CustomError("Usuario no encontrado", 404);
  }

  const invalidProperties = Object.keys(userData).filter((property) => !validUserPropertiesUser.includes(property));
  if (invalidProperties.length > 0) {
    throw new CustomError(`Actualización de usuario cancelada. Propiedades no válidas: ${invalidProperties.join(", ")}`, 400);
  }

  Object.assign(userToUpdate, userData);

  const userUpdated = await userOdm.saveUser(userToUpdate, foto);
  if (!userUpdated) {
    throw new CustomError("Los usuarios no han sido encontrados", 404);
  }

  return userUpdated;
};

const deleteUserById = async (id: number): Promise<User> => {
  const userToDelete = await userDto.getUserById(id);
  const userDeleted = await userOdm.deleteUser(userToDelete);
  if (!userDeleted) {
    throw new CustomError("Usuario no borrado", 403);
  }

  return userDeleted;
};

export const userDto = {
  countUsers,
  createUser,
  verifyInsertData,
  verifyValidProperties,
  getAllUser,
  getUserById,
  updateUser,
  deleteUserById,
};
