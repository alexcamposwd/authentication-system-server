import mongoose, { Document, Schema, model } from "mongoose";

export const UserSchema: Schema = new Schema({
  createdAt: Date,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user", required: true },
}, {
  timestamps: true,
  collection: 'users',
  versionKey: false
});

const User = mongoose.model("User", UserSchema);

export default User
