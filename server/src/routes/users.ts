import express, { Request, Response } from "express";
import Test from "../models/testModel";
import authMiddleware from "../middleware/auth";
import multer from "multer";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import * as dotenv from "dotenv";

const router = express.Router();
dotenv.config();
router.use(authMiddleware);

router.get("/users", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // const token = req.cookies.token;
    // @ts-ignore
    const { userId } = jwt.verify(token!, process.env.SECRET_WORD);
    const user = await User.findById(userId);
    if (user?.role === "admin") {
      const users = await User.find({ role: "user" });
      res.status(200).json(users);
    } else {
      res
        .status(403)
        .json({ error: "You must be admin for get list of users" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
});

router.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // const token = req.cookies.token;
    // @ts-ignore
    const { userId } = jwt.verify(token!, process.env.SECRET_WORD);
    const user = await User.findById(userId);
    if (user?.role === "admin") {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } else {
      res.status(403).json({ error: "You must be admin for get user" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
