const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Student = require("../models/Student");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

exports.registerStudent = async (req, res) => {
  const { first_name, middle_name, last_name, email, password } = req.body;
  const alreadyRegistered = await Student.findOne({ email });
  if (alreadyRegistered) {
    throw new CustomError.BadRequestError("Email already registered");
  }
  const user = await Student.create({
    first_name,
    middle_name,
    last_name,
    email,
    password,
  });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await Student.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Student not found");
  }

  const passwordIsCorrect = await user.comparePassword(password);

  if (!passwordIsCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ data: tokenUser });
};
