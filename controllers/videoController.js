const db = require("../server");

// Upload video
const uploadVideo = (req, res) => {
  const { title, description, user_id } = req.body;
  const video_url = req.file ? req.file.path : null;

  if (!title || !user_id || !video_url)
    return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });

  db.query(
    "INSERT INTO videos (user_id, title, description, video_url) VALUES (?, ?, ?, ?)",
    [user_id, title, description, video_url],
    (err, result) => {
      if (err) return res.status(500).json({ fatal: true });
      res.status(201).json({ message: "Video uploaded successfully" });
    }
  );
};

// Get all videos
const getVideos = (req, res) => {
  db.query("SELECT * FROM videos ORDER BY created_at DESC", (err, result) => {
    if (err) return res.status(500).json({ fatal: true });
    res.status(200).json(result);
  });
};

// Like video
const likeVideo = (req, res) => {
  const video_id = req.params.id;
  const { user_id } = req.body;
  db.query("INSERT INTO likes (video_id, user_id) VALUES (?, ?)", [video_id, user_id], (err) => {
    if (err) return res.status(500).json({ fatal: true });
    res.status(200).json({ message: "Video liked" });
  });
};

// Comment video
const commentVideo = (req, res) => {
  const video_id = req.params.id;
  const { user_id, comment } = req.body;
  db.query(
    "INSERT INTO comments (video_id, user_id, comment) VALUES (?, ?, ?)",
    [video_id, user_id, comment],
    (err) => {
      if (err) return res.status(500).json({ fatal: true });
      res.status(200).json({ message: "Comment added" });
    }
  );
};

// Share video
const shareVideo = (req, res) => {
  const video_id = req.params.id;
  const { user_id } = req.body;
  db.query("INSERT INTO shares (video_id, user_id) VALUES (?, ?)", [video_id, user_id], (err) => {
    if (err) return res.status(500).json({ fatal: true });
    res.status(200).json({ message: "Video shared" });
  });
};

module.exports = { uploadVideo, getVideos, likeVideo, commentVideo, shareVideo };
