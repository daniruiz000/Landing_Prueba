import { type Request, type Response, type NextFunction } from "express";
import * as fs from "fs";
import path from "path";

import { generateToken } from "../../utils/token";
import { pageContent, pageStyles } from "../../theme/homeHtml";

import { excelDto } from "../dto/excel.dto";
import { promotionDto } from "../dto/promotionDto";

const SQL_DATABASE: string = process.env.SQL_DATABASE as string;

const showHomePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.send(`<html><head>${pageStyles}</head><body>${pageContent}</body></html>`);
  } catch (error) {
    next(error);
  }
};

const showLoginPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.sendFile(path.join(__dirname, "../../../public/login.html"));
  } catch (error) {
    next(error);
  }
};

const doLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    promotionDto.verifyValidCredentials(req.body);
    const { email, password } = req.body;
    const jwtToken = generateToken(email, password);
    console.log("Usuario logado correctamente");
    res.status(200).json({ token: jwtToken });
  } catch (error) {
    next(error);
  }
};

const generateExcelAndSendToDownload = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    promotionDto.verifyValidCredentials(req);
    const workbook = await excelDto.createExcelWithUsers();

    const fileName = `users_${SQL_DATABASE}.xlsx`;
    const filePath = path.join(fileName);
    await workbook.xlsx.writeFile(filePath);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("end", () => {
      fs.unlinkSync(filePath);
      res.status(200).end();
    });
    console.log("Excel enviado correctamente.");
  } catch (error) {
    next(error);
  }
};

export const homeService = {
  showHomePage,
  showLoginPage,
  doLogin,
  generateExcelAndSendToDownload,
};
