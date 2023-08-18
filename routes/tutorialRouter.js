const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authentication");
const {
  createTutorial,
  getSingleTutorial,
  getAllTutorials,
  updateTutorial,
  deleteTutorial,
  uploadVideo,
} = require("../controllers/tutorialController");

router.route("/").post(authenticateUser, createTutorial).get(getAllTutorials);

router.route("/upload-video").post(authenticateUser, uploadVideo);

router
  .route("/:id")
  .get(authenticateUser, getSingleTutorial)
  .patch(authenticateUser, updateTutorial)
  .delete(authenticateUser, deleteTutorial);

module.exports = router;
