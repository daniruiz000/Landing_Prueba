import { type Response, type NextFunction } from "express";
import { userDto } from "../dto/user.dto";
import { promotionDto } from "../dto/promotionDto";

const createUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDataInsert = req.body;
    const foto = req.files?.foto ? req.files.foto[0].buffer.toString("base64") : null;

    await promotionDto.verifyIsPromotionActive();
    const userDataValidated = await userDto.verifyInsertData(userDataInsert);

    await userDto.createUser(userDataValidated, foto);

    console.log("Usuario creado correctamente.");
    res.status(201).send("Usuario creado correctamente.");
  } catch (error) {
    next(error);
  }
};

export const userService = {
  createUser,
};
