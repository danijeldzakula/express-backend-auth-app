import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

type TUser = Document & {
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  setRefreshToken(refreshToken: string): Promise<void>;
};

// Define User Schema
const userSchema: Schema<TUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password before saving
userSchema.pre<TUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    console.error('🚀 ~ err:', err);
    next();
  }
});

// Method to compare input password with the hashed password in the database
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to set refresh token
userSchema.methods.setRefreshToken = async function (
  refreshToken: string
): Promise<void> {
  this.refreshToken = refreshToken;
  await this.save();
};

// Create and export the User model
const User = mongoose.model<TUser>('User', userSchema);

export default User;
