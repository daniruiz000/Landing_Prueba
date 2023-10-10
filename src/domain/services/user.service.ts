import { type Request, type NextFunction } from "express";
import { userDto } from "../dto/user.dto";
import { type User } from "../entities/User";

const createUser = async (req: Request, next: NextFunction): Promise<User | undefined> => {
  try {
    const userData = req.body;
    const newUser = await userDto.createUser(userData);
    return newUser;
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (next: NextFunction): Promise<User[] | undefined> => {
  try {
    const userList = await userDto.getAllUser();

    return userList;
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, next: NextFunction): Promise<any> => {
  try {
    const dataToUpdate = req.body;
    const idReceivedInParams = parseInt(req.params.id);

    return await userDto.updateUser(dataToUpdate, idReceivedInParams);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (idReceivedInParams: number, next: NextFunction): Promise<User | null | undefined> => {
  try {
    const user = await userDto.getUserById(idReceivedInParams);

    return user;
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (idReceivedInParams: number, next: NextFunction): Promise<User | undefined> => {
  try {
    const user = await userDto.deleteUserById(idReceivedInParams);

    return user;
  } catch (error) {
    next(error);
  }
};

export const userService = {
  createUser,
  getAllUser,
  updateUser,
  getUserById,
  deleteUserById,
};
