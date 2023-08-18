const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

const {
  registerTeacher,
  loginTeacher,
  getSingleTeacher,
  getAllTeachers,
} = require("../controllers/teacherController");

router.post("/register", registerTeacher);
router.post("/login", loginTeacher);

router
  .route("/:id")
  .get(authenticateUser, authorizePermissions("admin"), getSingleTeacher);

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllTeachers);

module.exports = router;
