const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../errors");
const Student = require("../models/Student");

exports.registerStudent = async (req, res) => {
  const { first_name, middle_name, last_name, email, password } = req.body;
  const alreadyRegistered = await Student.findOne({ email });
  if (alreadyRegistered) {
    throw new CustomError.BadRequestError("Email already registered");
  }
  const student = await Student.create({
    first_name,
    middle_name,
    last_name,
    email,
    password,
  });
  res.status(StatusCodes.OK).json({ data: student });
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const student = await Student.findOne({ email });
  if (!student) {
    throw new CustomError.BadRequestError("Student not found");
  }

  const passwordIsCorrect = await student.comparePassword(password);

  if (!passwordIsCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  res.status(StatusCodes.OK).json({ data: student });
};
