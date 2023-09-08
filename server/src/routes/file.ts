import express, { Request, Response } from "express";
import Test from "../models/testModel";
import authMiddleware from "../middleware/auth";
import multer from "multer";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import File from "../models/fileModel";

import * as dotenv from "dotenv"; // Middleware для аутентификации

const router = express.Router();
dotenv.config();
router.use(authMiddleware);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // @ts-ignore
    const { userId } = jwt.verify(token!, process.env.SECRET_WORD);
    const user = await User.findById(userId);

    if (user?.role === "admin" && req.file) {
      console.log(req.file);
      const file = new File({
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.buffer.length,
        buffer: req.file.buffer,
        // path: imageSaveTo,
      });
      await file.save();
      await res
        .status(201)
        .json({ message: "Image uploaded successfully", file });
    } else {
      res.status(403).json({ error: "You must be admin for create file" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});
router.get("/get/:id", async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.params.id);
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ error });
  }
});
export default router;
