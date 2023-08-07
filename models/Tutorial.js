const mongoose = require("mongoose");

const TutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "PLEASE PROVIDE A TITLE FOR THE TUTORIAL"],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: [true, "PLEASE PROVIDE A DESCRIPTION FOR THE TUTORIAL"],
      trim: true,
      maxlength: 150,
    },
    video: {
      type: String,
      required: [true, "PLEASE PROVIDE A VIDEO FOR THE TUTORIAL"],
    },
    tutor: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TutorialSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "tutorial",
});

module.exports = mongoose.model("Tutorial", TutorialSchema);
