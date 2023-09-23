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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const fileDataSchema = new mongoose_1.Schema({
    file: { type: String },
    mimeType: { type: String },
});
const questionSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    file: { type: String },
    fileData: fileDataSchema,
    answerType: { type: String },
    answers: [
        {
            answer: { type: String, required: true },
            userAnswer: { type: String },
            isCorrect: { type: Boolean },
        },
    ],
});
const testSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    timerEnabled: { type: Boolean, required: true },
    timer: { type: Number },
    answeredUsers: { type: [mongoose_1.default.Types.ObjectId] },
    createdBy: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    questions: { type: [questionSchema], required: true },
});
exports.default = mongoose_1.default.model("Test", testSchema);
