import { infoReq } from "../server/infoReq.middleware";
import { checkError } from "../server/checkErrorRequest.middleware";
import { userRouter } from "./user.routes";
import { homeRouter } from "./home.routes";
import { type Express } from "express";
import { connect, disconnect } from "../server/connect.middleware";

export const configureRoutes = (app: Express): Express => {
  app.use("/", infoReq, connect, homeRouter, disconnect);
  app.use("/user", infoReq, connect, userRouter, disconnect);
  app.use(checkError);
  return app;
};
