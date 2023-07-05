const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  //SET AS DEFAULT
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "SOMETHING WENT WRONG, PLEASE TRY AGAIN!",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  //DUPLICATE ERROR
  if (err.code && err.code === "11000") {
    customError.msg = `Duplicate value entered for ${object.keys(
      err.value
    )} field, please choose a different value.`;
    customError.statusCode = 400;
  }

  //CAST ERROR
  if (err.name === "CastError") {
    customError.msg = `No item with id: ${err.value}`;
    customError.statusCode = 404;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
