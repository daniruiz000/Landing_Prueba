import { infoReq } from "../server/infoReq.middleware";
import { checkError } from "../server/checkErrorRequest.middleware";
import { userRouter } from "./user.routes";
import { homeRouter } from "./home.routes";

export const configureRoutes = (app: any): any => {
  app.use("/", infoReq, homeRouter);
  app.use("/user", infoReq, userRouter);
  app.use(checkError);
  return app;
};
