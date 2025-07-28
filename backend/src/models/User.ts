import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dob: Date,
    otp: String,
    googleId: String,
    name: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
