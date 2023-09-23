"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jwt = __importStar(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const dotenv = __importStar(require("dotenv"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
dotenv.config();
router.post("/register", upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, role, email, firstname, lastname, age } = req.body;
        const existingUser = yield userModel_1.default.findOne({ username });
        const existingEmail = yield userModel_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }
        const user = new userModel_1.default({
            username,
            password,
            role,
            email,
            firstname,
            lastname,
            age,
        });
        yield user.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
router.post("/login", upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield userModel_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const isMatch = yield user.comparePassword(password);
        if (isMatch && process.env.SECRET_WORD) {
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_WORD, {
                expiresIn: "24h",
            });
            // res.cookie("token", token, { httpOnly: true });
            return res.status(200).json({
                message: "Authentication successful",
                token,
                role: user.role,
                answers: user.answers,
                userId: user._id,
            });
        }
        else {
            return res.status(401).json({ error: "Authentication failed" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Authentication failed" });
    }
}));
exports.default = router;
