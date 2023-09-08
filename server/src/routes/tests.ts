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
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/tests", upload.any(), async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // @ts-ignore
    const { userId } = jwt.verify(token!, process.env.SECRET_WORD);
    const user = await User.findById(userId);

    if (user?.role === "admin") {
      const { title, description, questions } = req.body;
      console.log(req.body);
      const test = new Test({
        title,
        description,
        createdBy: userId,
        questions,
      });
      await test.save();
      if (user) {
        await user.updateOne({ $push: { tests: test._id } });
      }

      res.status(201).json(test);
    } else {
      res.status(403).json({ error: "You must be admin for create test" });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error });
  }
});

router.get("/tests", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // const token = req.cookies.token;
    // @ts-ignore
    const { userId } = jwt.verify(token!, process.env.SECRET_WORD);
    const tests = await Test.find({ createdBy: userId });
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
});

router.get("/tests/:id", async (req: Request, res: Response) => {
  try {
    const test = await Test.findById(req.params.id);
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.patch(
  "/tests/:id",
  upload.none(),
  async (req: Request, res: Response) => {
    try {
      const test = await Test.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json(test);
    } catch (error) {
      res.status(500).json({ error });
    }
  },
);
router.delete("/tests/:id", async (req: Request, res: Response) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
