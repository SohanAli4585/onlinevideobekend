const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadVideo, getVideos, likeVideo, commentVideo, shareVideo } = require("../controllers/videoController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
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
