import { infoReq } from "../server/infoReq.middleware";
import { checkError } from "../server/checkErrorRequest.middleware";
import { userRouter } from "./user.routes";
import { homeRouter } from "./home.routes";
import { type Express } from "express";

export const configureRoutes = (app: Express): Express => {
  app.use("/", infoReq, homeRouter);
  app.use("/user", infoReq, userRouter);
  app.use(checkError);
  return app;
};
