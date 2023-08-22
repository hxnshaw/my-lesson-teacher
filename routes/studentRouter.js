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
} = require("../controllers/studentController");

router.post("/register", registerStudent);
router.post("/login", loginStudent);

router
  .route("/:id")
  .get(authenticateUser, authorizePermissions("admin"), getSingleStudent);

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllStudents);

module.exports = router;
