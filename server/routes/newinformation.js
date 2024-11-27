const express = require("express");
const router = express.Router();
const newinformations = require("../Controllers/newinformationcontroller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 25, // Limit file size to 5MB
  },
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|pdf|xls|xlsx/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Only .jpeg, .jpg, .png, .pdf, .xls, and .xlsx files are allowed!"
        )
      );
    }
  },
});

// Create a new birth record
router.post("/", upload.single("file"), newinformations.sendMessages);

module.exports = router;
