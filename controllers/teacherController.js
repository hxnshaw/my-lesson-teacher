const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Teacher = require("../models/Teacher");

//Admin Registration
exports.registerTeacher = async (req, res) => {
  const { first_name, middle_name, last_name, email, password } = req.body;

  const alreadyRegistered = await Teacher.findOne({ email });

  if (alreadyRegistered) {
    throw new CustomError.BadRequestError("Email is already registered");
  }

  const teacher = await Teacher.create({
    first_name,
    middle_name,
    last_name,
    email,
    password,
  });
  res.status(StatusCodes.OK).json({ data: teacher });
};

exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const teacher = await Teacher.findOne({ email });

  if (!teacher) throw new CustomError.BadRequestError("Not Found");

  const passwordIsCorrect = await teacher.comparePassword(password);

  if (!passwordIsCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  res.status(StatusCodes.OK).json({ data: teacher });
};
