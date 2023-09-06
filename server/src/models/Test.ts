import mongoose, { Schema, Document } from "mongoose";

interface ITest extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  questions: {
    question: string;
    file?: Blob;
    answers: { answer: string; isCorrect: boolean }[];
  }[];
}
const questionSchema = new Schema({
  question: { type: String, required: true },
  file: { type: Object },
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
  createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  questions: { type: [questionSchema], required: true },
});

export default mongoose.model<ITest>("Test", testSchema);
