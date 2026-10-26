
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    rollNo: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    }
  },
  { timestamps: true }
);

studentSchema.index(
  { teacherId: 1, rollNo: 1 },
  { unique: true }
);

module.exports = mongoose.model("Student", studentSchema);
