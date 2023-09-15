const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Student = require("../models/Student");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

exports.registerStudent = async (req, res) => {
  const { first_name, middle_name, last_name, email, password, phone_number } =
    req.body;
  try {
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
      phone_number,
    });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new CustomError.BadRequestError(
        "Please provide email and password"
      );
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
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getSingleStudent = async (req, res) => {
  const { id: studentId } = req.params;
  try {
    const student = await Student.findOne({ _id: studentId }).select(
      "-password"
    );
    if (!student) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Student not found" });
    }
    res.status(StatusCodes.OK).json({ data: student });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}).select("-password");
    if (students === null) {
      throw new CustomError.NotFoundError(`Students Not Found`);
    }
    res.status(StatusCodes.OK).json({ data: students });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await Student.findOne({ _id: userId });

    if (!user) {
      throw new CustomError.NotFoundError(`Student Not Found`);
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ data: tokenUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
