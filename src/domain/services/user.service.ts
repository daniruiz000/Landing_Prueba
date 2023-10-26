import { type Response, type NextFunction } from "express";
import { userDto } from "../dto/user.dto";
import { verifyDto } from "../dto/verify.dto";

const createUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDataInsert = req.body;
    const foto = req.files.foto ? req.files.foto[0].buffer.toString("base64") : null;

    verifyDto.verifyIsPromotionActive();
    await verifyDto.verifyLimitOfUsers();
    verifyDto.verifyValidProperties(userDataInsert);

    await userDto.createUser(userDataInsert, foto);

    console.log("Usuario creado correctamente.");
    res.status(201).send("Usuario creado correctamente.");
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const credentials = req;

    verifyDto.verifyValidCredentials(credentials);
    const userArray = await userDto.getAllUser();

    console.log("Usuarios obtenidos correctamente.");
    res.status(200).json(userArray);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const credentials = req;
    const idReceivedInParams = parseInt(req.params.id);

    verifyDto.verifyValidCredentials(credentials);
    const user = await userDto.getUserById(idReceivedInParams);

    console.log("Usuario obtenido correctamente.");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const credentials = req;
    const idReceivedInParams = parseInt(req.params.id);

    verifyDto.verifyValidCredentials(credentials);
    await userDto.deleteUserById(idReceivedInParams);

    console.log("Usuario borrado correctamente.");
    res.status(200).send("Usuario borrado correctamente.");
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDataInsert = req.body;
    const credentials = req;
    const idReceivedInParams = parseInt(req.params.id);
    const foto = req.files.foto ? req.files.foto[0].buffer : null;

    verifyDto.verifyValidCredentials(credentials);
    const updateUser = await userDto.updateUser(userDataInsert, idReceivedInParams, foto);

    console.log("Usuario actualizado correctamente.");
    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
};
