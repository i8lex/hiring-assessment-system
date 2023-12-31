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
import usersRoutes from "./routes/users";
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
app.options("*", cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());
// app.use(cookieParser());
app.use(
  session({
    // @ts-ignore
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

const allowedOrigins = [process.env.URL, process.env.URL_PROD];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
app.use("/api", authRoutes);
app.use("/api", testRoutes);
app.use("/api", usersRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
