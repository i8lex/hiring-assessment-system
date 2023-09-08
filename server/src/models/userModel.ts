import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  age: number;
  firstname: string;
  lastname: string;
  role: "user" | "admin";
  tests: mongoose.Types.ObjectId[];
  answers: [];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    unique: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [86, "Username must be at most 32 characters long"],
    required: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [32, "Password must be at most 32 characters long"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter and one number",
    ],
  },
  age: {
    type: Number,
    required: false,
  },
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  answers: [],
  role: { type: String, required: true, enum: ["user", "admin"] },
  tests: [{ type: mongoose.Types.ObjectId, ref: "Test" }],
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
