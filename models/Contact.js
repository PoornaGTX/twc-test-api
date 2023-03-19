import mongoose from "mongoose";
import validator from "validator";

const ContactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide full name"],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide phone number"],
      maxlength: 10,
    },
    gender: {
      type: String,
      required: [true, "Please provide gender"],
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", ContactSchema);