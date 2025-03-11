const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    filename: { type: [String], required: true },
    groupname: { type: String, required: true },
  },
  { strict: false }
);

module.exports = mongoose.model("File", fileSchema);
