const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Admin = require("../models/Admin");

//Admin Registration
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const alreadyRegistered = await Admin.findOne({ email });

  if (alreadyRegistered) {
    throw new CustomError.BadRequestError("Email is already registered");
  }

  const admin = await Admin.create({ name, email, password });
  res.status(StatusCodes.OK).json({ data: admin });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const admin = await Admin.findOne({ email });

  if (!admin) throw new CustomError.BadRequestError("Not Found");

  const passwordIsCorrect = await admin.comparePassword(password);

  if (!passwordIsCorrect) {
    throw new CustomError.BadRequestError("Invalid Credentials");
  }
  res.status(StatusCodes.OK).json({ data: admin });
};
