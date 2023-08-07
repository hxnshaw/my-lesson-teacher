const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    student: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    tutorial: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Tutorial",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
