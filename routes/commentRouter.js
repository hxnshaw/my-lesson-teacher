const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  createComment,
  getSingleComment,
} = require("../controllers/commentController");

router.route("/").post(authenticateUser, createComment);

router.route("/:id").get(authenticateUser, getSingleComment);

module.exports = router;
