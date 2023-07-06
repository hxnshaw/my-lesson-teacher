const mongoose = require("mongoose");
const validator = require("validator");
//const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide a Name"],
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
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
