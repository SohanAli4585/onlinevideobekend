const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const {
  uploadVideo,
  getVideos,
  likeVideo,
  commentVideo,
  shareVideo,
} = require("../controllers/videoController");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Video APIs
router.post("/upload", upload.single("video"), uploadVideo);
router.get("/", getVideos);
router.post("/:id/like", likeVideo);
router.post("/:id/comment", commentVideo);
router.post("/:id/share", shareVideo);

module.exports = router;
