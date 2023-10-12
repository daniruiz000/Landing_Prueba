import { Router } from "express";
import { homeService } from "../domain/services/home.service";
import { isAuth } from "../server/auth.middleware";

export const homeRouter = Router();

homeRouter.get("/", homeService.showHomePage);
homeRouter.get("/login", homeService.showLoginPage);
homeRouter.post("/do-login", homeService.doLogin);
homeRouter.get("/get-xlsx-database", isAuth, homeService.generateExcelAndSendToDownload);
