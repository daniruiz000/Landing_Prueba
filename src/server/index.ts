import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { configureRoutes } from "../routes/index";
import { checkError } from "./checkErrorRequest.middleware";

dotenv.config();

const CORS_PORT_ORIGIN: string = process.env.CORS_PORT_ORIGIN as string;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: CORS_PORT_ORIGIN,
  })
);

app.use(checkError);

configureRoutes(app);
