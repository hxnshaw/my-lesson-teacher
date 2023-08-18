const Tutorial = require("../models/Tutorial");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermissions = require("../utils/checkPermissions");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const createTutorial = async (req, res) => {
  try {
    req.body.user = req.user.userId;
    const tutorial = await Tutorial.create({
      ...req.body,
      tutor: req.user.userId,
    });
    console.log(req.user.userId);
    res.status(StatusCodes.CREATED).json({ tutorial });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getSingleTutorial = async (req, res) => {
  try {
    const { id: tutorialId } = req.params;
    const tutorial = await Tutorial.findOne({ _id: tutorialId });
    console.log(tutorialId);
    if (!tutorial) {
      throw new CustomError.NotFoundError(`Tutorial Not Found`);
    }
    res.status(StatusCodes.OK).json({ data: tutorial });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getAllTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find({});
    res.status(StatusCodes.OK).json({ tutorials });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateTutorial = async (req, res) => {
  const { id: tutorialId } = req.params;
  const { title, description } = req.body;
  try {
    const tutorial = await Tutorial.findOne({ _id: tutorialId });

    if (!tutorial) {
      throw new CustomError.NotFoundError(`Tutorial Not Found`);
    }

    checkPermissions(req.user, tutorial.tutor);

    tutorial.title = title;
    tutorial.description = description;

    await tutorial.save();
    res.status(StatusCodes.OK).json({ tutorial });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteTutorial = async (req, res) => {
  try {
    const { id: tutorialId } = req.params;
    const tutorial = await Tutorial.findOne({ _id: tutorialId });

    if (!tutorial) {
      throw new CustomError.NotFoundError(`No tutorial found`);
    }
    checkPermissions(req.user, tutorial.tutor);
    await Tutorial.deleteOne({ _id: tutorialId });
    res.status(StatusCodes.OK).json({ message: "Tutorial Deleted" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const uploadVideo = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      {
        use_filename: true,
        folder: "lesson-teacher",
        resource_type: "video",
      }
    );
    fs.unlinkSync(req.files.video.tempFilePath);
    return res
      .status(StatusCodes.OK)
      .json({ video: { src: result.secure_url } });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  createTutorial,
  getSingleTutorial,
  getAllTutorials,
  updateTutorial,
  deleteTutorial,
  uploadVideo,
};
