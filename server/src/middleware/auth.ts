import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
type UserData = {
  userId: string;
};

const authMiddleware = (
  req: Request & { userData?: UserData },
  res: Response,
  next: NextFunction,
) => {
  try {
    dotenv.config();
    const token = req.headers.authorization
      ? req.headers.authorization?.split(" ")[1]
      : null;
    // const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    if (process.env.SECRET_WORD) {
      req.userData = jwt.verify(token, process.env.SECRET_WORD) as UserData;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

export default authMiddleware;
