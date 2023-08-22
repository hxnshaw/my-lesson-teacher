const CustomError = require("../errors");
const { isValidToken } = require("../utils");
const Student = require("../models/Student");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  //const referenceCode = referenceCode.toString();
  if (!token) {
    throw new CustomError.UnauthenticatedError("INVALID AUTHENTICATION");
  }

  try {
    const { first_name, last_name, userId, role, email, phone_number } =
      isValidToken({
        token,
      });
    req.user = {
      first_name,
      last_name,
      userId,
      role,
      email,
      phone_number,
    };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("INVALID AUTHENTICATION");
    //res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "UNAUTHORIZED TO ACCESS THIS ROUTE."
      );
    }
    next();
  };
};

const studentHasSubscribed = () => {
  return async (req, res, next) => {
    try {
      const student = await Student.findOne({ _id: req.user.userId });
      console.log(student);
      if (student.referenceCode.length == 0) {
        throw new CustomError.UnauthorizedError(
          "UNAUTHORIZED TO ACCESS THIS ROUTE"
        );
      }
      next();
    } catch (error) {
      res.send(error.message);
    }
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
  studentHasSubscribed,
};
