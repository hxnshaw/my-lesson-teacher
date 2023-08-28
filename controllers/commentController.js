const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Tutorial = require("../models/Tutorial");
//const checkPermissions = require("../utils/checkPermissions");

exports.createComment = async (req, res) => {
  const { tutorial: tutorialId } = req.body;
  try {
    const tutorial = await Tutorial.findOne({ _id: tutorialId });
    if (!tutorial) {
      throw new CustomError.NotFoundError("No tutorial found");
    }
    req.body.user = req.user.userId;
    const comment = await Comment.create(req.body);
    res.status(StatusCodes.CREATED).json({ comment });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getSingleComment = async (req, res) => {
  const { id: commentId } = req.params;
  try {
    const comment = await Comment.findOne({ _id: commentId }).populate({
      path: "user",
      select: "first_name last_name",
    });

    if (!comment) {
      throw new CustomError.NotFoundError("No comment found");
    }
    res.status(StatusCodes.OK).json({ data: comment });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
