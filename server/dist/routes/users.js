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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
dotenv.config();
router.use(auth_1.default);
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        // const token = req.cookies.token;
        // @ts-ignore
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD);
        const user = yield userModel_1.default.findById(userId);
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const users = yield userModel_1.default.find({ role: "user" });
            res.status(200).json(users);
        }
        else {
            res
                .status(403)
                .json({ error: "You must be admin for get list of users" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch tests" });
    }
}));
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        // const token = req.cookies.token;
        // @ts-ignore
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD);
        const user = yield userModel_1.default.findById(userId);
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            const user = yield userModel_1.default.findById(req.params.id);
            res.status(200).json(user);
        }
        else {
            res.status(403).json({ error: "You must be admin for get user" });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
router.put("/users/:userId/reset/:testId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const testId = req.params.testId;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
            !mongoose_1.default.Types.ObjectId.isValid(testId)) {
            return res.status(400).json({ error: "Invalid user or test ID" });
        }
        yield userModel_1.default.findByIdAndUpdate(userId, {
            $pull: {
                answers: { testId: testId },
                tests: testId,
            },
        }, { new: true });
        yield testModel_1.default.findByIdAndUpdate(testId, {
            $pull: {
                answeredUsers: userId,
            },
        }, { new: true });
        res.status(200);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
exports.default = router;
