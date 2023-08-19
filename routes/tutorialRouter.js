const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  createTutorial,
  getSingleTutorial,
  getAllTutorials,
  updateTutorial,
  deleteTutorial,
  uploadVideo,
} = require("../controllers/tutorialController");

router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions("admin", "teacher"),
    createTutorial
  )
  .get(authenticateUser, getAllTutorials);

router
  .route("/upload-video")
  .post(
    authenticateUser,
    authorizePermissions("admin", "teacher"),
    uploadVideo
  );

router
  .route("/:id")
  .get(authenticateUser, getSingleTutorial)
  .patch(
    authenticateUser,
    authorizePermissions("admin", "teacher"),
    updateTutorial
  )
  .delete(
    authenticateUser,
    authorizePermissions("admin", "teacher"),
    deleteTutorial
  );

module.exports = router;
