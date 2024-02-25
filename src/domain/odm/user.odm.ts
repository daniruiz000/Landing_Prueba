import { type IUser, User } from "../entities/User";

const countUsers = async (): Promise<number> => {
  const userCount = await User.countDocuments();

  return userCount;
};

const getAllUser = async (): Promise<IUser[]> => {
  const userList = await User.find();
  return userList;
};

const saveUser = async (userDataValidated: IUser, foto: string): Promise<IUser> => {
  const userNew = new User();
  Object.assign(userNew, userDataValidated);
  userNew.foto = foto;

  const userSaved = await User.create(userNew);

  return userSaved;
};

export const userOdm = {
  countUsers,
  getAllUser,
  saveUser,
};
