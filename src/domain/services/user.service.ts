import { type Request, type Response, type NextFunction } from "express";

import { userDto } from "../dto/user.dto";

import { verifyIsPromotionActive, verifyLimitOfUsers, verifyValidProperties } from "../../utils/verifyInsertData";

const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDataInsert = req.body;

    verifyIsPromotionActive();
    await verifyLimitOfUsers();
    verifyValidProperties(userDataInsert);

    const createdUser = await userDto.createUser(userDataInsert);
    console.log("Usuario creado correctamente.");
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

export const userService = {
  createUser,
};
