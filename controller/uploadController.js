const express = require("express");
const multer = require("multer");
const File = require("../model/fileModel");
const { parseCSV, fileFilter } = require("../utils/functionUtils");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, fileFilter }).array("files");

// Upload CSV Files
router.post("/upload", upload, async (req, res) => {
  try {
    const { unique_key, group_name } = req.body;
    let results = {};

    for (const file of req.files) {
      const parsedData = await parseCSV(file.buffer);

      if (!parsedData?.length) {
        return res
          .status(400)
          .json({ message: `Invalid CSV file: ${file.originalname}` });
      }

      parsedData.forEach((row) => {
        const uniqueKey = row[unique_key];

        if (!uniqueKey) {
          return res.status(400).json({
            message: `Error in file ${file.originalname} 'Key is missing'. Cannot upload`,
          });
        }

        const documentId = `${uniqueKey}_${group_name}`;

        results[documentId] = results[documentId] || {
          _id: documentId,
          filename: file.originalname,
          groupname: group_name,
        };

        const filenames = new Set(
          Array.isArray(results[documentId].filename)
            ? [...results[documentId].filename, file.originalname]
            : [results[documentId].filename, file.originalname]
        );

        results[documentId].filename =
          filenames.size === 1 ? [...filenames][0] : [...filenames];

        Object.entries(row).reduce((acc, [key, value]) => {
          if (key !== uniqueKey) {
            if (!acc[key]) {
              acc[key] = value;
            } else {
              const existingValues = Array.isArray(acc[key])
                ? acc[key]
                : [acc[key]];
              const uniqueValues = new Set([...existingValues, value]);
              acc[key] =
                uniqueValues.size > 1
                  ? [...uniqueValues]
                  : [...uniqueValues][0];
            }
          }
          return acc;
        }, results[documentId]);
      });
    }

    let bulk_write_obj = [];

    Object.values(results).forEach((doc) => {
      bulk_write_obj.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: doc },
          upsert: true,
        },
      });
    });

    await File.bulkWrite(bulk_write_obj);

    res.status(200).json({
      message: "Files uploaded and stored successfully",
    });
  } catch (err) {
    console.error("Error processing files:", err);
    res
      .status(500)
      .json({ message: "Error uploading files", error: err.message });
  }
});

module.exports = router;
