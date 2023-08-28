const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/authentication");
const {
  createComment,
  getSingleComment,
  updateComment,
} = require("../controllers/commentController");

router.route("/").post(authenticateUser, createComment);

router
  .route("/:id")
  .get(authenticateUser, getSingleComment)
  .patch(authenticateUser, updateComment);

module.exports = router;
