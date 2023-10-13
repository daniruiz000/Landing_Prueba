import { type Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../repositories/typeorm-datasource";
import { CustomError } from "../../server/checkErrorRequest.middleware";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

const validateInsertData = async (userData: User): Promise<void> => {
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

  if (userToValidate.dni && !userToValidate.validateDni()) {
    throw new CustomError("El DNI proporcionado no cumple con los requisitos", 400);
  }

  if (userToValidate.telefono && !userToValidate.validatePhoneNumber()) {
    throw new CustomError("El número de teléfono proporcionado no cumple con los requisitos", 400);
  }
};

const countUsers = async (): Promise<number> => {
  const userCount = await userRepository.count();

  return userCount;
};

const getAllUser = async (): Promise<User[]> => {
  const userList = await userRepository.find();

  return userList;
};

const getUserById = async (id: number): Promise<User | null> => {
  const user = await userRepository.findOne({ where: { id } });

  return user;
};

const saveUser = async (userData: any, foto: string, factura: string): Promise<User> => {
  await validateInsertData(userData);
  const userNew = new User();
  Object.assign(userNew, userData);
  userNew.foto = foto;
  userNew.factura = factura;
  const userSaved = await userRepository.save(userNew);

  return userSaved;
};

const deleteUser = async (user: User): Promise<User> => {
  const userDeleted = await userRepository.remove(user);
  return userDeleted;
};

export const userOdm = {
  validateInsertData,
  countUsers,
  getAllUser,
  getUserById,
  saveUser,
  deleteUser,
};
