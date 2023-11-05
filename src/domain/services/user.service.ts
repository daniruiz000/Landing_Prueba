import { type Response, type NextFunction } from "express";
import { type CustomRequest } from "../../server/auth.middleware";
import { userDto } from "../dto/user.dto";
import { promotionDto } from "../dto/promotionDto";

const createUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userDataInsert = req.body;
    const foto = userDataInsert.files.foto ? userDataInsert.files.foto[0].buffer.toString("base64") : null;

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
