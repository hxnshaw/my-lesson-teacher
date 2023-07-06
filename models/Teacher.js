const mongoose = require("mongoose");
const validator = require("validator");
//const bcrypt = require("bcryptjs");

const TeacherSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please Provide Your First Name"],
      trim: true,
    },
    middle_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Please Provide Your Last Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Provide an Email Address"],
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Please Provide a Password"],
      trim: true,
      minlength: 7,
    },
    role: {
      type: String,
      default: "teacher",
    },
    subjects: {
      type: String,
      required: [true, "Please Choose Areas of Expertise"],
      enum: ["Physics", "Chemistry", "Government"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", TeacherSchema);
