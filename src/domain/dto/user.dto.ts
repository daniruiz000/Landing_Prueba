import { CustomError } from "../../server/checkErrorRequest.middleware";
import { validUserPropertiesUser, type User } from "../entities/User";
import { userOdm } from "../odm/user.odm";

const countUsers = async (): Promise<number> => {
  const userCount = await userOdm.countUsers();
  if (!userCount) {
    throw new CustomError("Fallo en el recuento de usuarios", 400);
  }

  return userCount;
};

const createUser = async (user: any): Promise<User> => {
  const newUser = await userOdm.saveUser(user);
  if (!newUser) {
    throw new CustomError("El usuario no ha sido registrado", 400);
  }
  return newUser;
};

const getUserById = async (id: number): Promise<User> => {
  const user = await userOdm.getUserById(id);

  if (!user) {
    throw new CustomError("El usuario no ha sido encontrado", 404);
  } else {
    return user;
  }
};

const getAllUser = async (): Promise<User[]> => {
  const userList = await userOdm.getAllUser();
  if (!userList) {
    throw new CustomError("Los usuarios no han sido encontrados", 404);
  }
  return userList;
};

const updateUser = async (userData: any, idReceivedInParams: number): Promise<User> => {
  const userToUpdate = await userDto.getUserById(idReceivedInParams);

  if (!userToUpdate) {
    throw new CustomError("Usuario no encontrado", 404);
  }

  // Verificar si hay alguna propiedad en los datos del usuario que no sea válida
  const invalidProperties = Object.keys(userData).filter((property) => !validUserPropertiesUser.includes(property));

  if (invalidProperties.length > 0) {
    throw new CustomError(`Actualización de usuario cancelada. Propiedades no válidas: ${invalidProperties.join(", ")}`, 400);
  }

  // Actualizar las propiedades válidas del usuario
  Object.assign(userToUpdate, userData);

  const userUpdated = await userOdm.saveUser(userToUpdate);
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
  getUserById,
  getAllUser,
  updateUser,
  deleteUserById,
};
