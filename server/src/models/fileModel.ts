import mongoose, { Document, Schema } from "mongoose";

interface IFile extends Document {
  filename: string;
  mimetype: string;
  size: number;
  buffer: Object;
}
const fileSchema: Schema = new Schema({
  filename: String,
  mimetype: String,
  size: Number,
  buffer: Object,
});
export default mongoose.model<IFile>("File", fileSchema);
