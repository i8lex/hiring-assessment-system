import express, { Request, Response } from "express";
import User from "../models/userModel";
import * as jwt from "jsonwebtoken";
import multer from "multer";
import * as dotenv from "dotenv";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
dotenv.config();
router.post("/register", upload.none(), async (req: Request, res: Response) => {
  try {
    const { username, password, role, email, firstname, lastname, age } =
      req.body;

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const user = new User({
      username,
      password,
      role,
      email,
      firstname,
      lastname,
      age,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/login", upload.none(), async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const isMatch = await user.comparePassword(password);

    if (isMatch && process.env.SECRET_WORD) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.SECRET_WORD,
        {
          expiresIn: "24h",
        },
      );
      // res.cookie("token", token, { httpOnly: true });

      return res.status(200).json({
        message: "Authentication successful",
        token,
        role: user.role,
        answers: user.answers,
        userId: user._id,
      });
    } else {
      return res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

export default router;
