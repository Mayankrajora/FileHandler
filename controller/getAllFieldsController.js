const express = require("express");
const File = require("../model/fileModel");

const router = express.Router();

router.get("/get-files", async (req, res) => {
  try {
    const files = await File.find({}, { _id: 0, groupname: 1, filename: 1 });

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    let groupedFiles = {};
    files.forEach((file) => {
      if (!groupedFiles[file.groupname]) {
        groupedFiles[file.groupname] = [];
      }
      groupedFiles[file.groupname].push(file.filename);
    });

    res.status(200).json({ result: groupedFiles });
  } catch (err) {
    console.error("Error fetching files:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;
