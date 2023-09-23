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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const express_session_1 = __importDefault(require("express-session"));
// @ts-ignore
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// @ts-ignore
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const tests_1 = __importDefault(require("./routes/tests"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
if (process.env.MONGODB_URI) {
    mongoose_1.default.connect(process.env.MONGODB_URI, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}
else {
    console.error("MONGODB_URI is not defined in your environment variables.");
}
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Connected to mongoDB");
});
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use(express_1.default.json());
// app.use(cookieParser());
app.use((0, express_session_1.default)({
    // @ts-ignore
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
const allowedOrigins = [process.env.URL, process.env.URL_PROD];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
app.use("/api", auth_1.default);
app.use("/api", tests_1.default);
app.use("/api", users_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
