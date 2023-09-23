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
const testModel_1 = __importDefault(require("../models/testModel"));
const auth_1 = __importDefault(require("../middleware/auth"));
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv = __importStar(require("dotenv"));
const router = express_1.default.Router();
dotenv.config();
router.use(auth_1.default);
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post("/tests", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        // @ts-ignore
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD);
        const user = yield userModel_1.default.findById(userId);
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const { title, description, questions, timer, timerEnabled } = req.body;
            const test = new testModel_1.default({
                title,
                description,
                createdBy: userId,
                questions,
                timer,
                timerEnabled,
            });
            yield test.save();
            if (user) {
                yield user.updateOne({ $push: { tests: test._id } });
            }
            res.status(201).json(test);
        }
        else {
            res.status(403).json({ error: "You must be admin for create test" });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
router.get("/tests", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        // const token = req.cookies.token;
        // @ts-ignore
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD);
        const user = yield userModel_1.default.findById(userId);
        if (user) {
            const tests = yield testModel_1.default.find({ _id: { $in: user.tests } });
            const testToResponse = tests.map((test) => {
                return {
                    _id: test._id,
                    title: test.title,
                    description: test.description,
                    createdBy: test.createdBy,
                    timerEnabled: test.timerEnabled,
                    timer: test.timer,
                    answeredUsers: test.answeredUsers,
                    questionsQuantity: test.questions.length,
                };
            });
            res.status(200).json(testToResponse);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch tests" });
    }
}));
router.get("/tests/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const test = yield testModel_1.default.findById(req.params.id);
        res.status(200).json(test);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
router.put("/tests/:id", upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const test = yield testModel_1.default.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(test);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
router.put("/tests/send/:id", upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.id);
        if (user) {
            yield user.updateOne({ $push: { tests: req.body.testId } });
        }
        res.status(200).json({ message: "Successfully added" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
router.put("/answer", upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const token = yield ((_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1]);
        // const token = req.cookies.token;
        // @ts-ignore
        const { userId } = yield jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD);
        const user = yield userModel_1.default.findById(userId);
        const test = yield testModel_1.default.findById(req.body.testId);
        if (user && test) {
            yield test.updateOne({ $push: { answeredUsers: userId } });
            yield user.updateOne({ $push: { answers: req.body } });
            res.status(200).json({ message: "Successfully sent" });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
router.delete("/tests/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const test = yield testModel_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json(test);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
