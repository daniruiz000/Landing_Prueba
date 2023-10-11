import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;

export const generateToken = (email: string, password: string): string => {
  if (!email || !password) {
    throw new Error("Email or password missing");
  }

  const payload = {
    email,
    password,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
  return token;
};

export const verifyToken = (token: string): any => {
  if (!token) {
    throw new Error("Token is missing");
  }
  const result = jwt.verify(token, JWT_SECRET);
  return result;
};
