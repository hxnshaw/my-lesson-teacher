const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser.userId);
  // console.log(resourceUserId);
  if (requestUser.role === "admin") return;

  if (requestUser.userId === resourceUserId.toString()) return;

  throw new CustomError.UnauthorizedError("UNAUTHORIZED TO ACCESS THIS ROUTE");
};

module.exports = checkPermissions;
