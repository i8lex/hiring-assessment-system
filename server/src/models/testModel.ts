import mongoose, { Schema, Document } from "mongoose";

interface ITest extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  timerEnabled: string;
  timer: number;
  answeredUsers: mongoose.Types.ObjectId[];
  questions: {
    question: string;
    file: string;
    fileData: Object;
    answers: { answer: string; isCorrect: boolean }[];
  }[];
}
const fileDataSchema = new Schema({
  file: { type: String },
  mimeType: { type: String },
});

const questionSchema = new Schema({
  question: { type: String, required: true },
  file: { type: String },
  fileData: fileDataSchema,
  answers: [
    {
      answer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});
const testSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timerEnabled: { type: Boolean, required: true },
  timer: { type: Number },
  answeredUsers: { type: [mongoose.Types.ObjectId] },
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  questions: { type: [questionSchema], required: true },
});

export default mongoose.model<ITest>("Test", testSchema);
