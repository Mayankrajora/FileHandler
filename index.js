require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const uploadFile = require("./controller/uploadController");
const getAllFields = require("./controller/getAllFieldsController");

const app = express();
const PORT = process.env.PORT || 9000;

connectDB();
app.use(cors());
app.use(express.json());

// Route
app.use("/", uploadFile);
app.use("/", getAllFields);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
