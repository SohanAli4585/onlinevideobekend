const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();

// ---------------------
// Ensure uploads folder exists
// ---------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Uploads folder created");
}

// ---------------------
// Middlewares
// ---------------------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir)); // Serve videos

// ---------------------
// MySQL Database
// ---------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    process.exit(1);
  }
  console.log("✅ MySQL connected...");
});

module.exports = db;

// ---------------------
// Routes
// ---------------------
const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videos");

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
