const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");
const {
  registerStudent,
  loginStudent,
  getSingleStudent,
  getAllStudents,
  getUserProfile,
  updateStudentProfile,
  updateStudentPassword,
} = require("../controllers/studentController");

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.route("/profile").get(authenticateUser, getUserProfile);
router
  .route("/profile/update-profile")
  .patch(authenticateUser, updateStudentProfile);
router
  .route("/profile/update-password")
  .patch(authenticateUser, updateStudentPassword);

router
  .route("/:id")
  .get(authenticateUser, authorizePermissions("admin"), getSingleStudent);

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllStudents);

module.exports = router;
