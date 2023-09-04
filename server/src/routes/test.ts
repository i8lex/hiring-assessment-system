import express, { Request, Response } from 'express';
import Test from '../models/Test';
import authMiddleware from '../middleware/auth';
import multer from "multer";
import jwt from "jsonwebtoken";
import User from "../models/User";
import * as dotenv from "dotenv"; // Middleware для аутентификации

const router = express.Router();
dotenv.config();
router.use(authMiddleware);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/create', upload.none(), async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        // @ts-ignore
        const { userId } = jwt.verify(token!, process.env.SECRET_WORD);
        const user = await User.findById(userId);
        const { title, description, questions } = req.body;
        const test = new Test({ title, description, createdBy: userId, questions: questions });
        await test.save();
        if (user){
            user.tests.push(test._id);
            await user.save();
        }


        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ error});
    }
});

router.get('/list',  async (req: Request, res: Response) => {
    try {
        const tests = await Test.find();
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
});



export default router;
