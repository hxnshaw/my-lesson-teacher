const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  },
  { timestamps: true }
);

//Hash teacher Password
TeacherSchema.pre("save", async function () {
  const teacher = this;
  if (!teacher.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  teacher.password = await bcrypt.hash(teacher.password, salt);
});

//Check if password is correct
TeacherSchema.methods.comparePassword = async function (teacherPassword) {
  const teacher = this;
  const isMatch = await bcrypt.compare(teacherPassword, teacher.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  return isMatch;
};

module.exports = mongoose.model("Teacher", TeacherSchema);
