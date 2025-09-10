const db = require("../server");

// Upload video
const uploadVideo = (req, res) => {
  try {
    // Multer file
    if (!req.file) {
      return res.status(400).json({ message: "ভিডিও ফাইল প্রয়োজন" });
    }

    const { title, description, user_id } = req.body;

    if (!title || !user_id) {
      return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });
    }

    // Video path
    const video_url = req.file.path; // uploads/filename.mp4

    // Insert into DB
    db.query(
      "INSERT INTO videos (user_id, title, description, video_url) VALUES (?, ?, ?, ?)",
      [user_id, title, description, video_url],
      (err, result) => {
        if (err) {
          console.error("DB Insert Error:", err);
          return res.status(500).json({ fatal: true });
        }

        res.status(201).json({
          message: "ভিডিও সফলভাবে আপলোড হয়েছে",
          video: {
            id: result.insertId,
            user_id,
            title,
            description,
            video_url,
          },
        });
      }
    );
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ fatal: true });
  }
};

// Get all videos
const getVideos = (req, res) => {
  db.query("SELECT * FROM videos ORDER BY created_at DESC", (err, result) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ fatal: true });
    }
    res.status(200).json(result);
  });
};

// Like video
const likeVideo = (req, res) => {
  const video_id = req.params.id;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ message: "User ID missing" });

  db.query(
    "INSERT INTO likes (video_id, user_id) VALUES (?, ?)",
    [video_id, user_id],
    (err) => {
      if (err) {
        console.error("Like Error:", err);
        return res.status(500).json({ fatal: true });
      }
      res.status(200).json({ message: "ভিডিও লাইক হয়েছে" });
    }
  );
};

// Comment video
const commentVideo = (req, res) => {
  const video_id = req.params.id;
  const { user_id, comment } = req.body;
  if (!user_id || !comment)
    return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });

  db.query(
    "INSERT INTO comments (video_id, user_id, comment) VALUES (?, ?, ?)",
    [video_id, user_id, comment],
    (err) => {
      if (err) {
        console.error("Comment Error:", err);
        return res.status(500).json({ fatal: true });
      }
      res.status(200).json({ message: "Comment added" });
    }
  );
};

// Share video
const shareVideo = (req, res) => {
  const video_id = req.params.id;
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ message: "User ID missing" });

  db.query(
    "INSERT INTO shares (video_id, user_id) VALUES (?, ?)",
    [video_id, user_id],
    (err) => {
      if (err) {
        console.error("Share Error:", err);
        return res.status(500).json({ fatal: true });
      }
      res.status(200).json({ message: "ভিডিও শেয়ার হয়েছে" });
    }
  );
};

module.exports = { uploadVideo, getVideos, likeVideo, commentVideo, shareVideo };
