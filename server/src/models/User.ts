import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    username: string;
    password: string;
    tests: mongoose.Types.ObjectId[]
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    tests: [{ type: mongoose.Types.ObjectId, ref: 'Test' }],
});

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.log(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
