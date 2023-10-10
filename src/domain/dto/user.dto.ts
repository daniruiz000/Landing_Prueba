import { CustomError } from "../../server/checkErrorRequest.middleware";
import { type User } from "../entities/User";
import { userOdm } from "../odm/user.odm";

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

  if (userToUpdate) {
    Object.assign(userToUpdate, userData);
    if (userData.nombre !== undefined) {
      userToUpdate.nombre = userData.nombre;
    }

    if (userData.apellido !== undefined) {
      userToUpdate.apellido = userData.apellido;
    }

    if (userData.segundo_apellido !== undefined) {
      userToUpdate.segundo_apellido = userData.segundo_apellido;
    }

    if (userData.email !== undefined) {
      userToUpdate.email = userData.email;
    }

    if (userData.dni !== undefined) {
      userToUpdate.dni = userData.dni;
    }

    if (userData.telefono !== undefined) {
      userToUpdate.telefono = userData.telefono;
    }
  }

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
  createUser,
  getUserById,
  getAllUser,
  updateUser,
  deleteUserById,
};
