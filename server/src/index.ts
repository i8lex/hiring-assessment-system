// @ts-ignore
import session from "express-session";
// @ts-ignore
import cookieParser from "cookie-parser";
// @ts-ignore
import express from "express";
import mongoose from "mongoose";
// @ts-ignore
import cors from "cors";
import * as dotenv from "dotenv";
import testRoutes from "./routes/tests";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} else {
  console.error("MONGODB_URI is not defined in your environment variables.");
}
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to mongoDB");
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    // @ts-ignore
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
app.use("/api", authRoutes);
app.use("/api/tests", testRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
