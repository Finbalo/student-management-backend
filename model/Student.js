import mongoose, { Schema } from "mongoose";
import { regex } from "zod";

const studentSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
      index: true, // ✅ Add index for faster searches
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
      index: true, // ✅ Add index for faster searches
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Gay"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // ✅ Already unique, but explicit index
      lowercase: true,
    },
    matric_no: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // ✅ Already unique, but explicit index
      uppercase: true,
      regex: /^ADUN\/[A-Z]{2,6}\/[A-Z]{2,6}\/\d{2}\/\d{3}$/,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Create compound indexes for better query performance
studentSchema.index({ firstname: 1, lastname: 1 });
studentSchema.index({ createdAt: -1 }); // For sorting

const Student = mongoose.model("Student", studentSchema);

export default Student;
