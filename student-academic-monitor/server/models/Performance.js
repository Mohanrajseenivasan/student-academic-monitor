const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subjects: [
    {
      name: String,
      marks: Number,
      attendance: Number,
      needFocus: Boolean
    }
  ],

  remarks: {
    type: String
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // faculty
  }

}, { timestamps: true });

module.exports = mongoose.model("Performance", performanceSchema);
