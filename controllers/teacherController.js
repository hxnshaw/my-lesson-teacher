const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Teacher = require("../models/Teacher");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

//Admin Registration
exports.registerTeacher = async (req, res) => {
  const { first_name, middle_name, last_name, email, password } = req.body;
  try {
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
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new CustomError.BadRequestError(
        "Please provide email and password"
      );
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
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getSingleTeacher = async (req, res) => {
  const { id: teacherId } = req.params;
  try {
    const teacher = await Teacher.findOne({ _id: teacherId })
      .select("-password")
      .populate({
        path: "tutorial",
      });
    if (!teacher) {
      throw new CustomError.NotFoundError(`Teacher Not Found`);
    }
    res.status(StatusCodes.OK).json({ data: teacher });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    if (teachers == null) {
      throw new CustomError.NotFoundError(`Teachers Not Found`);
    }
    res.status(StatusCodes.OK).json({ count: teachers.length, data: teachers });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
