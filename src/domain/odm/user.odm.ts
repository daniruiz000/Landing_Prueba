import { type Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../repositories/typeorm-datasource";

const userRepository: Repository<User> = AppDataSource.getRepository(User);

const countUsers = async (): Promise<number> => {
  const userCount = await userRepository.count();

  return userCount;
};

const getAllUser = async (): Promise<User[]> => {
  const userList = await userRepository.find();

  return userList;
};

const saveUser = async (userDataValidated: User, foto: string): Promise<User> => {
  const userNew = new User();
  Object.assign(userNew, userDataValidated);
  userNew.foto = foto;

  const userSaved = await userRepository.save(userNew);

  return userSaved;
};

export const userOdm = {
  countUsers,
  getAllUser,
  saveUser,
};
