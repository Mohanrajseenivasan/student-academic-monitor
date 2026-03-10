const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  fileUrl: String,

  year: String,

  uploadedBy: String

});

module.exports = mongoose.model("Report", reportSchema);
