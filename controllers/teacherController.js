const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Teacher = require("../models/Teacher");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

//Admin Registration
exports.registerTeacher = async (req, res) => {
  const { first_name, middle_name, last_name, email, password } = req.body;

  const alreadyRegistered = await Teacher.findOne({ email });

  if (alreadyRegistered) {
    throw new CustomError.BadRequestError("Email is already registered");
  }

  const user = await Teacher.create({
    first_name,
    middle_name,
    last_name,
    email,
    password,
  });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ data: tokenUser });
};

exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await Teacher.findOne({ email });

  if (!user) throw new CustomError.BadRequestError("Not Found");

  const passwordIsCorrect = await user.comparePassword(password);

  if (!passwordIsCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ data: tokenUser });
};
