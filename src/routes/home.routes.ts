// home.routes.ts
import { Router, type Request, type Response, type NextFunction } from "express";
import path from "path";

const database = process.env.SQL_DATABASE as string;
const homeRouter = Router();

// Home de nuestra API:
homeRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageStyles = `
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            padding: 20px;
          }
          h3 {
            color: #333;
          }
          p {
            color: #777;
          }
          a {
            display: inline-block;
            text-decoration: none;
            color: #fff;
            background-color: #007BFF;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
            transition: background-color 0.3s;
          }
          a:hover {
            background-color: #0056b3;
          }
        </style>
      `;
    const pageContent = `
        <h3>Esta es la home de nuestra API.</h3>
        <p>Estamos utilizando la BBDD de ${database}.</p>
        <a href="/login">Acceso a Login</a>
      `;

    res.send(`<html><head>${pageStyles}</head><body>${pageContent}</body></html>`);
  } catch (error) {
    next(error);
  }
});

// Login dentro del homeRouter:
homeRouter.get("/login", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(__dirname, "../../public/login.html"));
});

export default homeRouter;
