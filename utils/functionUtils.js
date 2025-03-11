const { Readable } = require("stream");
const csvParser = require("csv-parser");

// Function to parse CSV buffer to JSON
const parseCSV = async (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csvParser())
      .on("data", (row) => results.push(row)) // Push each row as object
      .on("end", () => resolve(results)) // Resolve full parsed data array
      .on("error", (err) => reject(err));
  });
};

const fileFilter = (req, file, next) => {
  const allowedFileTypes = ["text/csv"];
  if (allowedFileTypes.includes(file.mimetype)) {
    next(null, true);
  } else {
    next(new Error("Only .csv files are allowed!"), false);
  }
};

module.exports = { parseCSV, fileFilter };
